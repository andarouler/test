import AWS from 'aws-sdk'


function handleUpload(videoFile : any, videoName : string ){
	
  console.log('video name: ' + videoName);

  // Set the region 
  AWS.config.update({region: 'eu-central-1'});

  //get env variables 
  const KEY_ID : string = process.env.REACT_APP_KEY_ID;
  const SECRET_KEY : string = process.env.REACT_APP_ACCESS_KEY;
  const S3_BUCKET : string = process.env.REACT_APP_S3_BUCKET;

  AWS.config.update({
      accessKeyId: KEY_ID,
      secretAccessKey: SECRET_KEY
  })
  
  // Create S3 service object
  var s3 = new AWS.S3({apiVersion: '2006-03-01'});

  // call S3 to retrieve upload file to specified bucket
  var uploadParams : any = {Bucket: S3_BUCKET, Key: videoName, Body: videoFile};


  // Configure the file stream and obtain the upload parameters
  const options = {
	// part size
  	partSize: 10 * 1024 * 1024, // 10mb
    // how many concurrent uploads
  	queueSize: 5
  };

  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, options, function (err, data) {
    if (err) {
      console.log('Error', err);
    } if (data) {
      console.log('Upload Success', data.Location);
    }
  });
}

export { handleUpload }
