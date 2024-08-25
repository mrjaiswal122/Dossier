'use client';
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux';
import {store } from '../_store/store';



export default function Providers({children}:{children:React.ReactNode}) {
  return (
    <section>

       <Provider store={store}>{children}</Provider>
    </section>


  )
}
