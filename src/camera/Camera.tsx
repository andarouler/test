import React, { useCallback, useEffect, useInsertionEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { handleUpload } from '../aws/handleUpload';
import { v4 as uuidv4 } from 'uuid';
import Button from '../Button';
import Microphone from '../audio/Microphone';
import axios, { AxiosResponse } from 'axios';
import { ContentDTO } from '../dto/content.dto';
import contentService from '../services/content.service';

const videoConstraints = {
  width: 540,
  facingMode: 'environment'
};


const Camera = () => {
  let handleDataAvailable : any = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [content, setContent] = useState<ContentDTO>(new ContentDTO());


  // fetch data from backend
  useEffect(() => {
    contentService.getContentById(1).then((response) => {
      setContent(response.data);
    });
  }, []);

  // const for enabeling start of video recording
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm'
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, handleDataAvailable, mediaRecorderRef]);

  // const for enabling abortion of video recording
  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  handleDataAvailable = React.useCallback(
    ({ data } : any)=> {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  // const for enabeling download of the video
  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/mp4'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      // video name with uuid
      const videoName = 'react-webcam-'+ uuidv4() + '.webm';

      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = videoName;
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
      // upload to s3 bucket
      handleUpload(blob, videoName);
    }
  }, [recordedChunks]);

  // components of first page
  return (
    <>
    <div style = {{position: 'absolute',  margin: '0', padding: '0', minWidth: '100%', minHeight: '100vh',
                  fontFamily: 'sans-serif', textAlign: 'center', color: '#000', background: '#fff'}}>
        <div>
            <h1>{content.headline1}</h1>
        </div>
        <div style={{position:'relative', marginBottom: '20px', fontSize: '1.15em'}}>
            {content.headline2}
        </div>
        <div style={{position:'relative', marginTop: '20px'}}>
            <Webcam
            ref={webcamRef}
            audio={true}
            videoConstraints={videoConstraints}
            />
        </div>
        <div style={{position:'relative'}}>
            <Microphone/>
        </div>

        {/* Properties of buttons are defiened in Button.tsx */}
        
        <div style={{position:'absolute', left: '70%', top: '70%', marginBottom: '10px'}}>
            <Button 
                border= '1px solid #fff'
                color='#fff'
                background='#1775d0'
                height = '2em'
                onClick={handleStartCaptureClick}
                radius = '4px'
                width = '270px'
                children = 'Beginne Videoaufzeichnung'
                cursor = 'pointer'
                fontSize = '1.15em'
            />
        </div>
        <div style={{position:'absolute', left: '50%', top: '70%', marginBottom: '10px'}}>
            <Button 
                border='1px solid #fff'
                color='#fff'
                background='#1775d0'
                height = '2em'
                onClick={handleStopCaptureClick}
                radius = '4px'
                width = '270px'
                children = 'Beende Videoaufzeichnung'
                cursor = 'pointer'
                fontSize = '1.15em'
            />
        </div>
        <div style={{position:'absolute', left: '20%', top: '70%', marginBottom: '10px'}}>
            <Button 
            border='1px solid #fff'
            color='#fff'
            background='#1775d0'
            height = '2em'
            onClick={handleDownload}
            radius = '4px'
            width = '100px'
            children = 'Download'
            cursor = 'pointer'
            fontSize = '1.15em'
            />
        </div>
    </div>
    </>
  );

} 
export default Camera;