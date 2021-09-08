import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import encode from './encoders/encode';
import { Blurhash, BlurhashCanvas } from 'react-blurhash';

function App() {
  const [blurHash, setBlurHash] = useState('');
  const [file, setFile] = useState(null);
  const [height, setHeight] = useState(0);

  const loadImage = async src => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });

  const getImageData = image => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    setHeight(canvas.height);
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0,0, image.width, image.height);
  }

  const encodeImageToBlurHash = async imageUrl => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
  }

  const handleChange = async event => {
    const file = URL.createObjectURL(event.target.files[0]);
    setFile(URL.createObjectURL(event.target.files[0]));
    const blurHash = await encodeImageToBlurHash(file);
    setBlurHash(blurHash);
  }
 
  return (
    <div className="h-100 d-flex justify-content-center align-items-center flex-column">
      <div className="row">
        <div className="col-6">
          {
            file && <img className="img-fluid" height="400" width="400" src={file} />
          }
        </div>
        <div className="col-6">
          {
            blurHash && 
              <BlurhashCanvas hash={blurHash} punch={1} />
            
          }
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3>Choose an image to upload</h3>
          <input type='file' onChange={handleChange} /> 
        </div>
      </div>  
    </div>
  );
}

export default App;
