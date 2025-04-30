import {useEffect,useState} from 'react'

function Notification() {

  const [data, setData] = useState('Initializing...')

  useEffect(() => {
    
    const sse = new EventSource('http://localhost:5000/stream')

    function handleStream(e){
      console.log(e)
      setData(e.data) //the data server are sedning 
    }

    sse.onmessage = e =>{handleStream(e)}

    sse.onerror = e => {
      //GOTCHA - can close stream and 'stall'
      sse.close()
    }

    return () => {
      sse.close()
      
    }
  }, )  

  return (
    <div>
     The last streamed item was: {data}
    </div>
  );
}

export default Notification;