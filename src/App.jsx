import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { db } from './firebaseConfig';
import { collection, addDoc, getDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import Select from 'react-select';

function App() {
  let now = new Date();
  let nowtext = now.toISOString().slice(0, 10);
  const [currentDate, setCurrentDate] = useState(nowtext);
  const [summary, setSummary] = useState(0);
  const [currentId, setCurrentId] = useState();
  const [startDate, setStartDate] = useState(nowtext);
  const [endDate, setEndDate] = useState(nowtext);
  const [summaryResult, setSummaryResult] = useState();
  const [summaryMembers, setSummaryMembers] = useState([]);
  const [summaryValue, setSummaryValue] = useState(0);
  const [password, setPassword] = useState("");
  const defaultMember = ([
    {
      name: "พรรณทิพา",
      value: 0,
      paid: false
    },
    {
      name: "กฤษณ์",
      value: 0,
      paid: false
    },
    {
      name: "ธิติสรรค์",
      value: 0,
      paid: false
    },
    {
      name: "อัจฉรียา",
      value: 0,
      paid: false
    },
    {
      name: "พีรดา",
      value: 0,
      paid: false
    },
    {
      name: "พัลลภ",
      value: 0,
      paid: false
    },
    {
      name: "จิรัฐิติกาล",
      value: 0,
      paid: false
    },
    {
      name: "จิรนันท์",
      value: 0,
      paid: false
    },
    {
      name: "จิรัชญา",
      value: 0,
      paid: false
    },
    {
      name: "สิรภพ",
      value: 0,
      paid: false
    },
    {
      name: "วสวัตติ์",
      value: 0,
      paid: false
    },
    {
      name: "กมลชนก",
      value: 0,
      paid: false
    },
    {
      name: "ปณิธิดา",
      value: 0,
      paid: false
    },
    {
      name: "ธีรพงษ์",
      value: 0,
      paid: false
    },
    {
      name: "ภูมิภัทร",
      value: 0,
      paid: false
    },
    {
      name: "อรรจิร์นุช",
      value: 0,
      paid: false
    },
    {
      name: "กิตติพิชญ์",
      value: 0,
      paid: false
    },
    {
      name: "อารียา",
      value: 0,
      paid: false
    },
    {
      name: "ชยวรรธก์",
      value: 0,
      paid: false
    }
  ]);
  const [currentMember, setCurrentMember] = useState(defaultMember);
  const [currentPage, setCurrentPage] = useState("entry");
  const options = currentMember.map(member => ({ value: member.name, label: member.name }));

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      const q = query(collection(db, "data"), where("date", "==", new Date(currentDate)));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          setCurrentId(doc.id);
          setCurrentMember(data.members);
          let sum = 0;
          data.members.forEach(item => {
            if (item.value != 99 && item.value != 101) {
              sum += item.value;
            }
          });
          setSummary(sum);
        });
      } else {
        setCurrentId(null);
        setCurrentMember([...defaultMember]);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const nextDate = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  }

  const prevDate = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  }

  const [selectedMember, setSelectedMember] = useState(null);

  const memberOptions = currentMember.map(member => ({
    value: member.name,
    label: member.name
  }));

  const handleSelect = (selectedOption) => {
    setSelectedMember(selectedOption);
    console.log("Selected Member:", selectedOption);
  };

  const handleChange = (name, value) => {
    let member = currentMember;
    let index = member.findIndex(item => item.name === name);
    member[index].value = value;
    setCurrentMember([...member]);
    let sum = 0;
    member.forEach(item => {
      if (item.value != 99 && item.value != 101) {
        sum += item.value;
      }
    });
    setSummary(sum);
  }

  const handleSave = async () => {
    if (currentId == null) {
      try {
        await addDoc(collection(db, "data"), {
          date: new Date(currentDate),
          members: currentMember
        });
        alert("Data saved successfully!");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      try {
        const docRef = doc(db, "data", currentId);
        await updateDoc(docRef, {
          ["members"]: currentMember
        });
        alert("Document updated successfully!");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };



  const summarize = async () => {
    try {
      const q = query(collection(db, "data"), where("date", ">=", new Date(startDate)), where("date", "<=", new Date(endDate)));
      const querySnapshot = await getDocs(q);
      let docs = [];
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          docs.push({ id: doc.id, data: data });
        });
      }
      let members = [];
      docs.forEach((doc) => {
        doc.data.members.forEach(member => {
          if (members.findIndex(item => item.name == member.name) == -1) {
            members.push({
              name: member.name, fifteen: member.value == 0 ? 1 : 0,
              thirty: member.value == 50 ? 1 : 0,
              onehour: member.value == 100 ? 1 : 0,
              twohour: member.value == 200 ? 1 : 0,
              absent: member.value == 300 ? 1 : 0,
              forgot: member.value == 99 ? 1 : 0,
              value: (member.value != 99 && member.value != 101) ? member.value : 0,
              paid: member.paid
            });
          } else {
            let index = members.findIndex(item => item.name == member.name);
            switch (member.value) {
              case 0: members[index].fifteen += 1
                break;
              case 50: members[index].thirty += 1
                break;
              case 100: members[index].onehour += 1
                break;
              case 200: members[index].twohour += 1
                break;
              case 300: members[index].absent += 1
                break;
              case 99: members[index].forgot += 1
                break;
            }
            if (member.value != 99 && member.value != 101) {
              members[index].value += member.value;
            }
            if (member.paid == false) {
              members[index].paid = false;
            }
          }
        }
        );
      });
      setSummaryMembers([...members]);
      let sumvalue = 0;
      members.forEach(member => {
        sumvalue += member.value;
      });
      setSummaryValue(sumvalue);
      setSummaryResult([...docs]);
    } catch (e) {
      console.log("error summarize", e);
    }
  }

  const togglePaid = async (name, paid) => {
    let allDocs = summaryResult;
    await allDocs.forEach(async (item) => {
      let members = item.data.members;
      let index = members.findIndex(member => member.name == name);
      members[index].paid = !paid;
      try {
        const docRef = doc(db, "data", item.id);
        await updateDoc(docRef, {
          ["members"]: members
        });
        console.log(`Document ${item.id} updated successfully!`);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    )
    summarize();
  }


  return (
    <div className='flex justify-center flex-col items-center p-0'>
      <h1 className='text-4xl font-bold'>OPD timesheet</h1>
      <div role="tablist" className="tabs tabs-bordered">
        <a role="tab" className={`tab ${currentPage == "entry" ? "tab-active" : ""}`} onClick={() => setCurrentPage("entry")}>Data entry</a>
        <a role="tab" className={`tab ${currentPage == "summary" ? "tab-active" : ""}`} onClick={() => setCurrentPage("summary")}>Summary</a>
      </div>
      {currentPage == "entry" &&
        <>
          <div className='flex gap-2 flex-row justify-center items-center mt-5'>
            <button className='btn btn-xs btn-neutral' onClick={prevDate}>Previous</button>
            <input className='input  p-3 border-2 input-bordered' type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
            <button className='btn btn-xs btn-primary' onClick={nextDate}>Next</button>
          </div>
          <div className='mt-5 w-full md:w-3/4 flex justify-center items-center gap-2'>
            <Select
              className='w-full'
              value={selectedMember}
              onChange={handleSelect}
              options={memberOptions}
              placeholder="Select a member"
            />
            <button className='btn btn-square' onClick={() => setSelectedMember(null)}>Clear</button>
          </div>
          <div className=' overflow-x-auto md:w-full'>
            <table className='table-xs md:table-md table'>
              <tr>
                <th></th>
                <th className='text-xs text-center border-l-2 border-b-2'>9.00-9.15<br></br>13.00-13.15</th>
                <th className='text-xs text-center border-b-2'>9.16-9.30<br></br>13.16-13.30</th>
                <th className='text-xs text-center border-b-2'>9.31-10.00<br></br>13.31-14.00</th>
                <th className='text-xs text-center border-b-2'>10.01-12.00<br></br>14.01-16.00</th>
                <th className='text-xs text-center border-b-2'>ไม่มา</th>
                <th className='text-xs text-center border-b-2'>ลืมลงชื่อ</th>
                <th className='text-xs text-center border-b-2'>สรุป</th>
              </tr>
              {currentMember.map(member => {
                if (member.name.includes(selectedMember ? selectedMember.label : ""))
                  return (
                    <tr>
                      <td className='text-xs text-center'>
                        {member.name}
                      </td>
                      <td className='text-center text-xs  border-b-2 border-l-2'><input type="radio" className='radio radio-xs' onChange={() => handleChange(member.name, 0)} name={member.name} id="" checked={member.value == 0} /></td>
                      <td className='text-center text-xs  border-b-2'><input type="radio" className=' radio radio-xs' onChange={() => handleChange(member.name, 50)} name={member.name} id="" checked={member.value == 50} /></td>
                      <td className='text-center text-xs  border-b-2'><input type="radio" className=' radio radio-xs' onChange={() => handleChange(member.name, 100)} name={member.name} id="" checked={member.value == 100} /></td>
                      <td className='text-center text-xs  border-b-2'><input type="radio" className=' radio radio-xs' onChange={() => handleChange(member.name, 200)} name={member.name} id="" checked={member.value == 200} /></td>
                      <td className='text-center text-xs  border-b-2'><input type="radio" className=' radio radio-xs' onChange={() => handleChange(member.name, 300)} name={member.name} id="" checked={member.value == 300} /></td>
                      <td className='text-center text-xs  border-b-2'><input type="radio" className=' radio radio-xs' onChange={() => handleChange(member.name, 99)} name={member.name} id="" checked={member.value == 99} /></td>
                      <td className='text-center text-xs  border-b-2 bg-slate-300 text-black'>{member.value == 99 || member.value == 101 ? 0 : member.value}</td>
                    </tr>
                  )
              })
              }
              <tr>
                <td colSpan={7} ></td>
                <td className='text-center  text-black bg-slate-400'>{summary}</td>
              </tr>
            </table>
          </div>
          <div className='mt-5 flex gap-2'>
            <button className='btn btn-primary' onClick={()=>document.getElementById('save_modal').showModal()}>Save</button>
          </div>
        </>
      }
      {currentPage == "summary" &&
        <>
          <div className='mt-5 flex gap-5'>
            <label htmlFor="" className='flex flex-col'>From
              <input className='input input-bordered' value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" name="" id="" />
            </label>
            <label htmlFor="" className='flex flex-col'>To
              <input className='input input-bordered' value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" name="" id="" />
            </label>
          </div>
          <div className='mt-5 mb-5'>
            <button className='btn btn-primary capitalize btn-sm' onClick={summarize}>summary</button>
          </div>
          <div className='w-full'>
            <table className='table table-xs md:table-md'>
              <tr>
                <th></th>
                <th className='text-xs text-center  border-b-2'>มาสาย</th>
                <th className='text-xs text-center border-b-2'>ไม่มา</th>
                <th className='text-xs text-center border-b-2'>ลืมลงชื่อ</th>
                <th className='text-xs text-center border-b-2'>สรุป</th>
                <th className='text-xs text-center border-b-2'>สถานะ</th>
              </tr>
              {summaryMembers.sort((a, b) => {
                const sumA = a.thirty + a.onehour + a.twohour + a.absent;
                const sumB = b.thirty + b.onehour + b.twohour + b.absent;
                return sumB - sumA; // Sort in descending order
              }).map(member =>
                <tr>
                  <td className='text-xs text-center border-b-2'>{member.name}</td>
                  <td className='text-xs text-center border-b-2'>{member.thirty + member.onehour + member.twohour}</td>
                  <td className='text-xs text-center border-b-2'>{member.absent}</td>
                  <td className='text-xs text-center border-b-2'>{member.forgot}</td>
                  <td className='text-xs text-center border-b-2 bg-slate-300 text-black'>{member.value}</td>
                  <td className='text-xs text-center border-b-2'><button onClick={() => togglePaid(member.name, member.paid)} className={`btn btn-xs text-black ${member.paid ? "bg-green-500" : "bg-red-500"}`}>{member.paid ? "จ่ายแล้ว" : "ยังไม่จ่าย"}</button></td>
                </tr>
              )
              }
              <tr>
                <td colSpan={4} ></td>
                <td className='text-center text-xs bg-slate-500'>{summaryValue}</td>
              </tr>
            </table>
          </div>
        </>
      }
      <dialog id="save_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Save Data</h3>
          <p className="py-4">Please enter the password</p>
          <input type="text" name="" className='input input-xs input-bordered' id="" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <div className="modal-action">
            <form method="dialog">
              {password == "0132" &&
              <button className='btn btn-primary' onClick={handleSave}>Submit</button>
              }
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default App
