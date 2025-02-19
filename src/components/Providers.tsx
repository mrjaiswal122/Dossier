'use client';
import { ReactNode } from 'react'
import { Provider } from 'react-redux';
import {store } from '../store/store';
import DarkMode from './DarkMode';


export default function Providers({children}:{children:ReactNode}) {

  return (
    
   <>
       <Provider store={store}>
        <DarkMode>
        {children}
        </DarkMode>
        </Provider>
  
   </>


  )
}
