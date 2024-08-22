import sharp from 'sharp';
import { createCanvas } from 'canvas';
import path from 'path';
import fs from 'node:fs'

export default async (name: string) => {
    let firstName = name.split(' ')[0];
    let secondName = name.split(' ')[1];

    function getInitials() {
        if (!firstName) return '';
        if (!secondName) return `${firstName.charAt(0).toUpperCase()}`;
        return `${firstName.charAt(0).toUpperCase()}${secondName.charAt(0).toUpperCase()}`;
    }

    const initials = getInitials();

   
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext('2d');

    
    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(0, 0, 300, 300);

   
    ctx.fillStyle = '#000000'; 
    ctx.font = 'bold 150px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    
    ctx.fillText(initials, 150, 150);

    
    const buffer = canvas.toBuffer('image/png');

    const image = await sharp(buffer).png().toBuffer();
    
    const filePath = path.join(__dirname, '..', 'uploads');
    console.log(filePath);
    
    const fileName = `${name.replace(/ /g, '_')}.png`;
 
    fs.writeFileSync(path.join(filePath, fileName), image);

    return fileName;
};

