'use client';

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BudgetUi from './BudgetUi'
import TripDurationUi from './TripDurationUi';
import FinalUi from './FinalUi';

type Message = {
  role: string,
  content: string,
  ui?: string
}

function Chatbox () {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState<string>()
  const [loading, setLoading] = useState(false)

  const onSend = async () => {
    if (!userInput?.trim()) return

    setLoading(true)
    setUserInput('')
    const newMessage: Message = {
      role: 'user',
      content: userInput
    }

    setMessages((prev: Message[]) => [...prev, newMessage])

    const result = await axios.post('/api/aimodel', {
      messages: [...messages, newMessage]
    })

    setMessages((prev: Message[]) => [
      ...prev,
      {
        role: 'assistant',
        content: result?.data?.resp,
        ui: result?.data?.ui
      }
    ])

    console.log(result.data)
    setLoading(false)
  }

  const RenderGenerativeUi=(ui:string) => {
    
    switch(ui){
      case 'budget': return <BudgetUi onSelectedOption= {(v:string) => { setUserInput(v); onSend()} }/>
      case 'groupSize': return <GroupSizeUi onSelectedOption= {(v:string) => { setUserInput(v); onSend()} }/>
      case 'TripDuration': return <TripDurationUi onSelectedOption= {(v:string) => { setUserInput(v); onSend()} }/>
      case 'Final': return <FinalUi viewTrip={()=> console.log()}/>; // Final Output, 
      default: return null; // No UI Component
    }

  }

  return (
    <div className='h-[85vh] flex flex-col '>

      {messages?.length == 0 && 
        <EmptyBoxState onSelectOption= {(v:string) => { setUserInput(v); onSend()} }/>
      }

      {/* DisplayMessages Section*/}
      <section className='flex-1 overflow-y-auto p-4'>
        {messages.map((msg: Message, index) =>
          msg.role == 'user' ? (
            //User Messages:
            <div className='flex justify-end mt-2' key={index}>
              <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                {msg.content}
              </div>
            </div>
          ) : (
            //AI Messages:
            <div className='flex justify-start mt-2' key={index}>
              <div className='max-w-lg bg-secondary text-black px-4 py-2 rounded-lg'>
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? '')}
              </div>
            </div>
          )
        )}

        {loading && <div className='flex justify-start mt-2' >
          <div className='max-w-lg bg-secondary text-black px-4 py-2 rounded-lg'>
             <Loader className='animate-spin'/>
          </div>
        </div>}
      </section>

      {/* User Input Section */}
      <section>
        <div className='border rounded-2xl p-4 shadow relative'>
          <Textarea
            className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
            placeholder='Start typing here!'
            onChange={event => setUserInput(event.target.value ?? '')}
            value={userInput}
          />

          <Button
            onClick={() => onSend()}
            size={'icon'}
            className='absolute bottom-6 right-6 cursor-pointer'
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Chatbox
