import React from 'react'
import Header from './_components/Header'


// This function provides a components inside the global layout to render:
function provider ({ children }: 
    Readonly<{ children: React.ReactNode }>) {
  //Starts after this:
  return <div>
    <Header/>
    {children}
  </div>
}

export default provider
