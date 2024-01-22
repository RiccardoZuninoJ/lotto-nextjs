"use client"
import { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import Link from 'next/link';
import { supabase } from './supabase';
import moment from 'moment';

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [ticketNumber, setTicketNumber] = useState(0);
  const [modal, setModal] = useState(false);
  const [ticketDraw, setTicketDraw] = useState(0);
  const [latestDrawFuture, setLatestDrawFuture] = useState({});
  const [lastDraws, setLastDraws] = useState([]);

  useEffect(() => {
    const getDraws = async () => {
      //I want them with date >= today
      const { data: draws, error: drawError } = await supabase
        .from('draws')
        .select('*')
        .eq('drawn', true)
        .order('draw_datetime', { ascending: false })
        .limit(5)

      setLastDraws(draws)

    }
    getDraws();
  }
    , [])
  const handleNumberClick = (number) => {
    setSelectedNumbers((prevNumbers) => {
      if (prevNumbers.includes(number)) {
        // Se il numero è già selezionato, rimuovilo
        return prevNumbers.filter((n) => n !== number);
      } else if (prevNumbers.length < 4) {
        // Se il numero non è selezionato e abbiamo meno di 4 numeri, aggiungilo
        return [...prevNumbers, number];
      } else {
        // Altrimenti, restituisci l'array precedente
        return prevNumbers;
      }
    });
  };
  useEffect(() => {
    console.log(lastDraws);
  }, [lastDraws]);
  const handleSend = async () => {
    //Use supabase database to insert the numbers
    //After that, get the ticket number and show it to the user (just inserted)
    //The ticket number will be used to check the winnings after the draw
    //get the latest draw id
    //Check if 4 numbers are selected
    if (selectedNumbers.length < 4) {
      alert('You must select 4 numbers')
      return
    }
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .select('*')
      .eq('drawn', false)
      .order('draw_datetime', { ascending: true })
      .limit(1)
      .single();
    const { data: play, error: ticketError } = await supabase
      .from('plays')
      .insert([
        {
          numbers: //JSONB FORMAT
            JSON.stringify(selectedNumbers), draw_id: draw.id
        },
      ]).select()
    setTicketNumber(play[0].id)
    setTicketDraw(draw.id)
    setModal(true)
    //Reset the selected numbers
    setSelectedNumbers([])

    //Open a modal with the ticket number
    //Use the ticket number to check the winnings after the draw

  }

  //Get the latest draw id and datetime which happens in the future
  useEffect(() => {
    const getLatestDraw = async () => {
      const { data: draw, error: drawError } = await supabase
        .from('draws')
        .select('*')
        .eq('drawn', false)
        .order('draw_datetime', { ascending: true })
        .limit(1)
        .single();
      if (drawError?.code === 'PGRST116') {
        console.log('No draws found')
        return;
      }
      setLatestDrawFuture(draw)
    }
    getLatestDraw()
  }
    , [])

  useEffect
  useEffect(() => {
    if (selectedNumbers.length > 4) {
      setSelectedNumbers((prevNumbers) => prevNumbers.slice(0, 4));
    }
  }, [selectedNumbers]);

  return (
    <main className="p-4">
      {ticketNumber > 0 && modal ?
        (
          //Modal
          //Show the ticket number 
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Good luck!
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      Your ticket number is: <span className="text-2xl font-bold text-green-500">#{ticketNumber}</span> (Draw #{ticketDraw}) <br></br>
                      You can check your winnings after the draw.

                    </p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setModal(false)}
                    >
                      Okay, close
                    </button>

                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : (
          <div></div>
        )

      }
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">RZJ Lotto\</h1>
          <p className="">Made with NextJS and Supabase</p>
        </div>
        <div className="flex flex-col">
          <Link href="/check">
            <button className="bg-green-500 text-white p-4 rounded-xl shadow-lg">Check your ticket</button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4 rounded text-white my-4 bg-red-500">
        <h1 className="text-2xl font-bold">Disclaimer!</h1>
        <p className="">This is a completely FAKE lottery,
          with no prizes. It is made for demonstration purposes only.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center p-4 rounded text-white my-4 bg-blue-500">
        <h1 className="text-2xl font-bold">Draws are every 6 hours, at 00:00, 06:00, 12:00, 18:00</h1>
      </div>
      <div className="flex flex-wrap flex-row space-x-8 align-center bg-gray-900 text-white rounded-xl justify-center p-8 shadow-lg my-4">
        <div className='flex flex-col'>
          <p className="text-2xl font-bold">Pick 4 numbers</p>
          <div className="grid grid-cols-6 lg:grid-cols-10 gap-4 rounded-xl ">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => handleNumberClick(number)}
                className={`p-2 rounded-xl border ${selectedNumbers.includes(number) ? 'bg-red-800 text-white' : ''}`}
              >
                {number}
              </button>
            ))}

          </div>
        </div>
        <div className="flex flex-col items-center justify-center my-4">
          <p className="text-2xl font-bold">Your numbers</p>
          <div className="flex flex-row space-x-4 mb-4 mt-4">
            {selectedNumbers.map((number) => (
              <p className="shadow-lg p-3 bg-gray-100 text-5xl font-bold text-orange-500"
                key={"s-" + number}
              >{number}</p>
            ))}
          </div>
          <button
            onClick={handleSend}
            className="bg-green-500 text-white p-4 rounded-xl shadow-lg">Play</button>
          <p className="text-sm mt-4">By clicking play, you will receive a ticket number. <br></br>Put this number after the draw to check your winnings. </p>
        </div>
      </div>
      <hr></hr>
      <div className="flex flex-col items-center justify-center  my-4">
        <h1 className="text-2xl font-bold">Next draw in
          <div className="text-5xl font-bold text-blue-500">
            {
              latestDrawFuture.draw_datetime ?
                //Create a countdown object with basic renderer
                <Countdown date={moment(latestDrawFuture.draw_datetime).toDate()}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      // Render a completed state
                      return <span>Draw done!</span>;
                    } else {
                      // Render a countdown
                      return <span>{days} days {hours} hours {minutes} minutes</span>;
                    }
                  }
                  }
                />
                : null
            }

          </div>
        </h1>
        <p>
          Choose your numbers, before the draw!
        </p>
      </div>
      <hr></hr>
      <div className="flex flex-col items-center justify-center my-4">
        <h1 className="text-2xl font-bold mb-4">Last 5 draws</h1>
        <div className='flex flex-row 
          space-x-4
        '>
          {lastDraws.map((draw) => (
            <div className="shadow-lg p-3 bg-gray-100 text-orange-500">
              <p className="text-2xl font-bold">Draw #{draw.id}</p>
              <p className="text-xl">Draw date: {moment(draw.draw_datetime).format('DD/MM/YYYY HH:mm')}</p>
              <div className="text-xl mb-4"><p>Drawn numbers:</p> <p
                className='mt-5'
              >{draw.results ? JSON.parse(draw.results).map((number) => (
                <span className='mr-4 bg-gray-800 text-2xl font-bold text-orange-500 p-3 rounded-xl'>{number}</span>
              )) : 'Draw not done yet'}</p></div>
            </div>
          ))}
        </div>
      </div>

      <hr></hr>
      <div className="flex flex-col items-center justify-center my-4">
        <h1 className="text-2xl font-bold mb-4">Odds and prizes</h1>
        <div className='flex flex-row'
        >
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Match</th>
                <th className="px-4 py-2">Odds</th>
                <th className="px-4 py-2">Prize*</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">4</td>
                <td className="border px-4 py-2">1 in 230.300</td>
                <td className="border px-4 py-2">$161.210</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border px-4 py-2">3</td>
                <td className="border px-4 py-2">1 in 1251.63</td>
                <td className="border px-4 py-2">$875.7</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">2</td>
                <td className="border px-4 py-2">1 in 37.09</td>
                <td className="border px-4 py-2">$26</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">1 in 3.79</td>
                <td className="border px-4 py-2">$2.65</td>
              </tr>
            </tbody>
          </table>
        </div>
        *Calculated with a 70% RTP (Return to Player).
      </div>
    </main >
  );
}