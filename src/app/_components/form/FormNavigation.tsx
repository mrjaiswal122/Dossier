import React, { Dispatch, SetStateAction } from 'react'

type Props = {
    setStep:Dispatch<SetStateAction<number>>,
    step:number
}
type PropsStep={
value:string,
setStep:Dispatch<SetStateAction<number>>,
num:number
step:number
}
export default function FormNavigation({setStep,step}:Props) {
    const steps10=["General","Bio","Skills","Resume","Url"]
  return (<>
  
  <div className='csw  h-20 bg-theme-light dark:bg-blue-muted flex items-center '>
    <div className='mx-auto max-w-3xl flex flex-wrap  gap-2  items-center justify-center'>

{steps10.map((value,index)=>(
   <Steps key={index} value={value} setStep={setStep} num={index} step={step}/>
))
}
    </div>
  </div>
  </>
  )


}
function Steps({num,value,setStep,step}:PropsStep){

    return(
        <>
        <div className='w-14 md:w-28 lg:w-20 xl:w-28  flex flex-col justify-center items-center h-16 gap-1 cursor-pointer hover:scale-110 transition-all duration-50 ease-in-out' onClick={()=>setStep(num+1)}>
      <h1 className={`${step==num+1?"bg-greens":"bg-theme"} flex justify-center items-center rounded-full  w-6 h-6`} onClick={()=>setStep(num+1)}>{num+1}</h1>
      <p className='hidden sm:block'>{value}</p>
        </div>
        </>
    )
}