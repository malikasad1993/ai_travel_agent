'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Loader, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import EmptyBoxState from './EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import TripDurationUi from './TripDurationUi';
import FinalUi from './FinalUi';
import PreferenceUi from './PreferenceUi';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  ui?: string;
};
type TripInfo = {
  budget: string ,
  destination: string,
  duration: string,
  group_size: string,
  hotels: any[],
  itinerary: any[],
  origin: string,
  preference: string
}

function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);

  // ✅ store final plan here
  const [tripPlan, setTripPlan] = useState<TripInfo>();

  // ✅ keep latest messages to avoid stale state bugs
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // ✅ single source of truth to send any text
  const sendMessage = async (text: string, finalFlag: boolean) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    setLoading(true);

    const newMessage: Message = { role: 'user', content: trimmed };

    // optimistic UI update
    const nextMessages = [...messagesRef.current, newMessage];
    setMessages(nextMessages);
    messagesRef.current = nextMessages;

    try {
      const result = await axios.post('/api/aimodel', {
        messages: nextMessages,
        isFinal: finalFlag
      });

      console.log('API RESULT:', result.data);

      // ✅ FINAL response: { trip_plan: {...} }
      if (finalFlag && result.data?.trip_plan) {
        setTripPlan(result.data.trip_plan);

        // ✅ push assistant message so Final UI actually renders
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '✅ Your trip plan is ready!',
            ui: 'Final'
          }
        ]);

        setLoading(false);
        return;
      }

      // ✅ Normal step response: { resp, ui }
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result?.data?.resp ?? '',
          ui: result?.data?.ui
        }
      ]);
    } catch (err: any) {
      console.error(err?.response?.data ?? err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry — something went wrong. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSend = async () => {
    if (loading) return;
    const text = userInput;
    setUserInput('');
    await sendMessage(text, isFinal);
  };

  const RenderGenerativeUi = (ui: string) => {
    switch (ui) {
      case 'budget':
        return <BudgetUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />;
      case 'groupSize':
        return <GroupSizeUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />;
      case 'TripDuration':
        return <TripDurationUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />;
      case 'Preference': 
        return <PreferenceUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />; 
      case 'Final':
        return <FinalUi tripPlan={tripPlan} viewTrip={() => console.log(tripPlan)} 
        disable = {!tripPlan} 
        />;
        
      default:
        return null;
    }
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    // ✅ when agent says Final, trigger final generation once
    if (lastMsg.role === 'assistant' && lastMsg.ui === 'Final' && !isFinal && !tripPlan) {
      setIsFinal(true);

      // ✅ no setUserInput race; send directly
      sendMessage('Generate the final trip plan now.', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <div className='h-[85vh] flex flex-col'>
      {messages?.length === 0 && (
        <EmptyBoxState onSelectOption={(v: string) => sendMessage(v, isFinal)} />
      )}

      {/* DisplayMessages Section */}
      <section className='flex-1 overflow-y-auto p-4'>
        {messages.map((msg: Message, index) =>
          msg.role === 'user' ? (
            <div className='flex justify-end mt-2' key={index}>
              <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                {msg.content}
              </div>
            </div>
          ) : (
            <div className='flex justify-start mt-2' key={index}>
              <div className='max-w-lg bg-secondary text-black px-4 py-2 rounded-lg'>
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? '')}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className='flex justify-start mt-2'>
            <div className='max-w-lg bg-secondary text-black px-4 py-2 rounded-lg'>
              <Loader className='animate-spin' />
            </div>
          </div>
        )}
      </section>

      {/* User Input Section */}
      <section>
        <div className='border rounded-2xl p-4 shadow relative'>
          <Textarea
            className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
            placeholder='Start typing here!'
            onChange={(event) => setUserInput(event.target.value ?? '')}
            value={userInput}
          />

          <Button
            onClick={onSend}
            size={'icon'}
            className='absolute bottom-6 right-6 cursor-pointer'
            disabled={loading}
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Chatbox;
