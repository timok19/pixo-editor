import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  base64data: string;
  constructor() {}

  // create a function to save loaded image into local storage
  async saveToLocalStorage(myImage: string) {
    const data = myImage;
    const blob = this.dataURItoBlob(data);
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.base64data = String(reader.result);
      localStorage.clear();
      this.saveFile(this.base64data);
    };
  }

  // convert dataURI to blob
  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  //save file to local storage
  saveFile(base64data: string) {
    // calculate the size of the data
    const size: number = base64data.length * 0.75;
    let compressedData: string = base64data;
    // check if the size is greater than 4 MB
    if (size > 4 * 1024 * 1024) {
      // use compression if the size is greater than 4 MB
      const image = new Image();
      image.src = base64data;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        compressedData = canvas.toDataURL('image/jpeg', 0.7);
        this.storeLargeImage(compressedData);
      };
    } else {
      const blob = this.dataURItoBlob(compressedData);
      // create a file from the data
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      // read the file as a data URL
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        localStorage.setItem('image', compressedData);
      };
    }
  }

  storeLargeImage(imageData: string) {
    // set the chunk size to 50KB
    const chunkSize = 50 * 1024;
    // calculate the number of chunks
    const chunks = Math.ceil(imageData.length / chunkSize);
    // store the number of chunks in local storage
    localStorage.setItem('imageChunks', chunks.toString());
    // store each chunk in local storage
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      const chunk = imageData.substring(start, end);
      localStorage.setItem(`imageChunk${i}`, chunk);
    }
  }

  async getLargeImage(): Promise<string> {
    // get the number of chunks from local storage
    const chunksString = localStorage.getItem('imageChunks');
    // convert the chunks string to a number
    const chunks = parseInt(chunksString, 10);
    // create an array to store the chunks
    const chunkArray = [];
    // retrieve each chunk from local storage and add it to the array
    for (let i = 0; i < chunks; i++) {
      chunkArray.push(localStorage.getItem(`imageChunk${i}`));
    }
    // combine the chunks into a single string
    const imageData = chunkArray.join('');

    // return the image data
    return imageData;
  }
}
