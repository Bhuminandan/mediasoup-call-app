import React, { useCallback, useEffect, useState } from 'react'
import { IoIosRefresh } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import axios from 'axios'
import{ useDispatch }from 'react-redux'
import { setRoom } from '../../redux/features/roomSlice'
import { FaRegCopy } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const [currentRoomId, setCurrentRoomId] = useState('')
    const [isCopied, setIsCopied] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const getRoomId = async () => {
            try {
                const roomId = await axios.get('https://localhost:9000/create-room')
                dispatch(setRoom(roomId.data.room))
                setCurrentRoomId(roomId.data.room)
                console.log("Room ID:", roomId.data.room);
            } catch (error) {
                console.log("Error creating room:", error);
            }
        }

        getRoomId()
    }, [dispatch])

    const handleCopyClick = useCallback((e) => {
        e.preventDefault();
        navigator.clipboard.writeText(`https://localhost:5173/join-video/${currentRoomId}`)
        setIsCopied(true)

        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }, [])

    const handleRegenerateClick = useCallback(() => {
        setCurrentRoomId('')
        setIsCopied(false)
    }, [])

    const handleJoinVideo = () => {
        navigate(`/join-video/${currentRoomId}`)
    }


  return (
    <div className='w-full h-full flex items-center justify-center bg-slate-400'>
        <div className='w-96 h-auto bg-white shadow-md rounded-md p-10'>
            <h1>Create Link</h1>
            <div className='mt-4'>
                <form>
                    <input 
                     value={currentRoomId}
                     onChange={(e) => setCurrentRoomId(e.target.value)}
                     className='border-none outline-none p-2 bg-stone-200 rounded-md'
                     type="text" 
                     placeholder='Video Link' 
                    />
                    <button
                    className='bg-stone-200 rounded-md p-3 ml-2'
                     onClick={handleCopyClick}
                    >{
                        !isCopied ? <FaRegCopy className='inline' /> : <IoCheckmarkDoneSharp />
                        
                        }</button>
                    <div className='flex items-center justify-start mt-4'>
                        <button
                        onClick={handleRegenerateClick}
                        className='hover:underline text-sm text-zinc-500 my-2'
                        >
                            Regenerate <IoIosRefresh className='inline' />
                        </button>
                    </div>
                </form>
                <button onClick={handleJoinVideo} className='bg-blue-500 text-white rounded-md p-3 w-full mt-4'>Join Video</button>
            </div>
        </div>
    </div>
  )
}

export default Dashboard