"use client"
//Check win page
import { useState } from 'react';
import { supabase } from '../supabase';
import Confetti from 'react-confetti'
import Link from 'next/link';

export default function Check() {
    const [ticketNumber, setTicketNumber] = useState(0);
    const [drawNumber, setDrawNumber] = useState(0);
    const [numbersWon, setNumbersWon] = useState(0);
    const [showWinnings, setShowWinnings] = useState(false);
    const [ticketNumbers, setTicketNumbers] = useState([]);
    const [drawNumbers, setDrawNumbers] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [error, setError] = useState("");
    const handleCheck = async () => {
        //Get the ticket numbers and the draw numbers
        const { data: ticket, error: ticketError } = await supabase
            .from('plays')
            .select('*')
            .eq('id', ticketNumber)
            .single();
        const { data: draw, error: drawError } = await supabase
            .from('draws')
            .select('*')
            .eq('id', drawNumber)
            .single();
        if (ticketError || draw.drawn === false) {
            setError("Ticket not found or draw not done yet! Please, try again later.")
            return
        }
        setTicketNumbers(JSON.parse(ticket.numbers))
        setDrawNumbers(JSON.parse(draw.results))

        console.log(JSON.parse(ticket.numbers));
        let extractedNumbers = JSON.parse(draw.results)
        let ticketNumbersCopy = JSON.parse(ticket.numbers)

        console.log(drawNumbers);
        //Check if the ticket numbers are in the draw numbers

        let numbersWon = 0;
        ticketNumbersCopy.forEach((number) => {
            if (extractedNumbers.includes(number)) {
                numbersWon++
            }
        })
        setNumbersWon(numbersWon)
        //Show the winnings

        setShowWinnings(true)
        if (numbersWon > 0) {
            setShowConfetti(true)
        }
    }
    return (
        <div className='h-screen  bg-gray-900'>
            <div className="flex flex-row justify-between bg-gray-900 text-white p-4">
                <div className="flex flex-col">
                    <Link href="/">
                        <h1 className="text-4xl font-bold">RZJ Lotto\</h1>
                    </Link>
                    <p className="">Made with NextJS and Supabase</p>
                </div>
                <div className="flex flex-col">
                </div>
            </div>
            <div className='
        w-full mt-16 flex flex-col items-center justify-center text-center text-white
        '>

                <div className=' rounded p-12  bg-gray-800 text-white'>
                    {error !== "" ?
                        <p className='bg-red-500 text-xl mb-4 p-4 rounded'>{error}</p>
                        : null
                    }
                    {showWinnings ?

                        <>
                            {
                                showConfetti ?
                                    <Confetti
                                        width={window.innerWidth
                                        }
                                        height={window.innerHeight}
                                    /> :
                                    null
                            }
                            <button className='bg-blue-500 text-white p-2 rounded shadow-lg mb-12' onClick={() => setShowWinnings(false)}>Check another ticket</button>
                            <h1 className='font-bold text-4xl'>Ticket #
                                {ticketNumber} - Draw #{drawNumber}
                            </h1>
                            <p className='text-2xl mb-4'>You won {numbersWon} numbers</p>
                            <hr></hr>
                            <p
                                className='text-xl my-8'
                            >You played                        </p>

                            <p className='font-bold text-2xl'>
                                {ticketNumbers.map((number) => (
                                    <span key={"a-" + number} className='mr-4 bg-gray-100 text-5xl font-bold text-orange-500 p-2'>{number}</span>
                                ))}
                            </p>

                            <p
                                className='text-xl my-8'
                            >Draw Results</p>
                            {drawNumbers.length === 0 ?
                                <p className='font-bold text-2xl'>Draw not done yet. Check again later!</p>
                                : null
                            }
                            <p className='font-bold text-2xl'>

                                {drawNumbers.map((number) => (
                                    <span key={"b-" + number} className='mr-4 bg-gray-100 text-5xl font-bold text-orange-500 p-1'>{number}</span>
                                ))}
                            </p>


                        </>
                        : (
                            <>
                                <h1 className='font-bold text-4xl'>Check your winnings</h1>
                                <p>Insert your ticket number and the draw number to check if you won</p>
                                <input
                                    className='border rounded p-2 my-2 mr-4 text-gray-900'
                                    type="number" placeholder="Ticket number" onChange={(e) => setTicketNumber(e.target.value)} />
                                <input type="number"
                                    className='border rounded p-2 my-2 mr-4 text-gray-900'

                                    placeholder="Draw number" onChange={(e) => setDrawNumber(e.target.value)} />
                                <button
                                    className='bg-green-500 text-white p-2 rounded shadow-lg'
                                    onClick={handleCheck}
                                >Check</button>
                            </>
                        )
                    }
                </div>

            </div >
        </div>
    )
}