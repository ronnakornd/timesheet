import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { db } from './firebaseConfig';
import { collection, addDoc, getDoc } from 'firebase/firestore';

function App() {
  let now = new Date();
  let nowtext = now.toISOString().slice(0,10);
  const [currentDate, setCurrentDate] = useState(nowtext);
  const [summary,setSummary] = useState(0);
  const [currentMember,setCurrentMember] = useState(
  [
    {
        name: "พรรณทิพา",
        value: 0
    },
    {
        name: "กฤษณ์",
        value: 0
    },
    {
        name: "ธิติสรรค์",
        value: 0
    },
    {
        name: "อัจฉรียา",
        value: 0
    },
    {
        name: "พีรดา",
        value: 0
    },
    {
        name: "พัลลภ",
        value: 0
    },
    {
        name: "จิรัฐิติกาล",
        value: 0
    },
    {
        name: "จิรนันท์",
        value: 0
    },
    {
        name: "จิรัชญา",
        value: 0
    },
    {
        name: "สิรภพ",
        value: 0
    },
    {
        name: "วสวัตติ์",
        value: 0
    },
    {
        name: "กมลชนก",
        value: 0
    },
    {
        name: "ปณิธิดา",
        value: 0
    },
    {
        name: "ธีรพงษ์",
        value: 0
    },
    {
        name: "ภูมิภัทร",
        value: 0
    },
    {
        name: "อรรจิร์นุช",
        value: 0
    },
    {
        name: "กิตติพิชญ์",
        value: 0
    },
    {
        name: "อารียา",
        value: 0
    }
]);

 useEffect(()=> {
        
 },[])

const fetchDate = () =>{
   
}

const handleChange = (name,value) =>{
   let member = currentMember;
   let index = member.findIndex(item => item.name === name);
   member[index].value = value;
   setCurrentMember([...member]);
   let sum = 0;
   member.forEach(item => {
        if(item.value != 99 && item.value != 101){
            sum+= item.value;
        }
   });
   setSummary(sum);
}

const handleSave = async () => {
  try {
    await addDoc(collection(db, "data"), {
      date: currentDate,
      members: currentMember
    });
    alert("Data saved successfully!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};



  return (
    <div className='flex justify-center flex-col items-center p-0'>
      <div>
        <h1 className='text-4xl font-bold'>OPD timesheet</h1>
        <input className='input mt-5 borderd p-3 border-2' type="date" value={currentDate} onChange={(e)=>setCurrentDate(e.target.value)}/>
      </div>
      <div>
        <table className='table'>
        <tr>
           <th></th>
           <th className='text-center border-l-2 border-b-2'>9.00-9.15<br></br>13.00-13.15</th>
           <th className='text-center border-b-2'>9.16-9.30<br></br>13.16-13.30</th>
           <th className='text-center border-b-2'>9.31-10.00<br></br>13.31-14.00</th>
           <th className='text-center border-b-2'>10.01-12.00<br></br>14.01-16.00</th>
           <th className='text-center border-b-2'>ไม่มา</th>
           <th className='text-center border-b-2'>ลืมลงชื่อ</th>
           <th className='text-center border-b-2'>เวรอื่น</th>
           <th className='text-center border-b-2'>สรุป</th>
        </tr>
        {currentMember.map(member => {
          return (
            <tr>
              <td>
               {member.name}
              </td>
              <td className='text-center border-l-2'><input type="radio"  onChange={()=>handleChange(member.name,0)}   name={member.name} id="" checked={member.value == 0} /></td>
              <td className='text-center'><input type="radio"  onChange={()=>handleChange(member.name,50)}  name={member.name} id="" checked={member.value == 50}/></td>
              <td className='text-center'><input type="radio"  onChange={()=>handleChange(member.name,100)}  name={member.name} id="" checked={member.value == 100}/></td>
              <td className='text-center'><input type="radio"  onChange={()=>handleChange(member.name,200)}  name={member.name} id="" checked={member.value == 200}/></td>
              <td className='text-center'><input type="radio"  onChange={()=>handleChange(member.name,300)}  name={member.name} id="" checked={member.value == 300}/></td>
              <td className='text-center'><input type="radio"  onChange={()=>handleChange(member.name,99)}  name={member.name} id="" checked={member.value == 99}/></td>
              <td className='text-center'><input type="radio"  onChange={()=>handleChange(member.name,101)}  name={member.name} id="" checked={member.value == 101}/></td>
              <td className='text-center'>{member.value==99 || member.value==101? 0:member.value }</td>           
            </tr>   
           )
          })
        }
        <tr>
          <td colSpan={8} ></td>
          <td className='text-center border-2'>{summary}</td>
        </tr>
        </table>
      </div>
      <div className='mt-5'>
         <button className='btn btn-primary' onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}

export default App
