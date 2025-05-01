import {useEffect,useState} from 'react'

function Notification() {

  const [data, setData] = useState('Initializing...')

  const [dataArray, setDataArray] = useState(() => {
    // Load initial data from local storage
    const savedData = localStorage.getItem('streamedData');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    
    const sse = new EventSource('http://localhost:5000/stream')

    function handleStream(e){
      console.log(e)
      setData(e.data) //the data server are sedning 

      setDataArray((prevArray) => {
        const updatedArray = [...prevArray, e.data];
        localStorage.setItem('streamedData', JSON.stringify(updatedArray));
        return updatedArray;
      });
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