import React, { useEffect, useState } from 'react';
import './Admin.css';
import io from 'socket.io-client';
import { get, post } from '../Services/API';
import { toast } from 'react-toastify';
import * as _ from 'lodash';


const socket = io.connect("http://localhost:4001");

function Admin() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [duration, setDuration] = useState(0);
  const [numberOfRewards, setNumberOfRewards] = useState(0);
  const [numberOfChallenges, setNumberOfChallenges] = useState(0);
  const [challengeDuration, setChallengeDuration] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      console.log('connected');
      setIsConnected(true);
    }

    const onDisconnect = () => {
      setIsConnected(false);
    }

    const onDuration = (data) => {
      setDuration(data);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('duration-countdown', onDuration);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('duration-countdown', onDuration);
    };
  }, []);

  useEffect(() => {
    get('/api/get', null, (data) => {
      console.log(data);
      const {
        numberOfRewards,
        numberOfChallenges,
        challengeDuration,
        running
      } = data.result
      setNumberOfRewards(numberOfRewards);
      setNumberOfChallenges(numberOfChallenges);
      setChallengeDuration(challengeDuration);
      setRunning(running);
    }, (err) => {
      console.log(err);
    });
  }, []);

  const onSetConfig = () => {
    const params = {
      nRewards: numberOfRewards,
      nChallenges: numberOfChallenges,
      cDuration: challengeDuration
    }
    post('/api/set', params, () => {
      toast.success('Config successfully!');
    }, (err) => {
      toast.error(_.get(err, 'result.error', ''));
    });
  };

  const onStartChallenge = () => {
    post('/api/start', null, () => {
      toast.success('Start Now!!');
    }, (err) => {
      toast.error(_.get(err, 'result.error', ''));
    });
  }

  return (
    <div className='flex flex-col items-center pt-[100px] bg-gray-900 text-white h-[100vh]'>
      <div className=' mt-10 border-[1px] border-solid border-slate-500  w-[400px]  gap-y-[30px] p-[20px] rounded-xl'>
        <p className='text-xl mt-[15px] font-black text-[30px] text-center'>Admin</p>
        <div className="Admin flex flex-col justify-around mt-[30px] gap-4 mb-[35px] ">
          <div className='Form flex flex-col gap-y-[10px] '>
            <label className='text-xl font-bold'>Number of Rewards:</label>
            <input className='border-[1px] border-solid border-slate-500 rounded-xl p-[8px] bg-gray-800' type='text' placeholder='Number'
              value={numberOfRewards}
              onChange={(event) => { setNumberOfRewards(event.target.value) }}
            />
          </div>
          <div className='Form flex flex-col gap-y-[10px] '>
            <label className='text-xl font-bold'>Number of Challenges:</label>
            <input className='border-[1px] border-solid border-slate-500 rounded-xl p-[8px] bg-gray-800' type='text' placeholder='Number'
              value={numberOfChallenges}
              onChange={(event) => { setNumberOfChallenges(event.target.value) }}
            />
          </div>
          <div className='Form flex flex-col gap-y-[10px] '>
            <label className='text-xl font-bold'>Challenge Duration in Minutes:</label>
            <input className='border-[1px] border-solid border-slate-500 rounded-xl p-[8px] bg-gray-800' type='text' placeholder='Number'
              value={challengeDuration}
              onChange={(event) => { setChallengeDuration(event.target.value) }}
            />
          </div>
        </div>
        <label className='text-xl font-bold font-bold'>Next Challenge in: <span>{duration}</span></label>
        <div className='Buttons-Container flex flex-row gap-x-[10px]'>
          <button className='Bridge flex-[6] px-[10px] py-[14px] text-base font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed mt-[30px]'
            onClick={onSetConfig}
          >
            Set Config
          </button>
          <button className='Bridge  flex-[6] px-[10px] py-[14px] text-base font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed mt-[30px]'
            onClick={onStartChallenge}
          >
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );

}

export default Admin;
