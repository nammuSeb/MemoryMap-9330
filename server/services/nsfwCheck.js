import { NsfwCheck } from '@vladmandic/nsfwjs';
import tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';

let model = null;

const loadModel = async () => {
  if (!model) {
    model = await NsfwCheck.load();
  }
  return model;
};

export const checkNSFW = async (buffer) => {
  try {
    const model = await loadModel();
    
    // Resize image to optimal size for NSFW detection
    const resized = await sharp(buffer)
      .resize(299, 299)
      .toBuffer();

    // Convert buffer to tensor
    const image = tf.node.decodeImage(resized, 3);
    
    // Get predictions
    const predictions = await model.classify(image);
    
    // Calculate NSFW score (sum of explicit content probabilities)
    const nsfwScore = predictions.reduce((score, pred) => {
      if (['Porn', 'Hentai', 'Sexy'].includes(pred.className)) {
        return score + pred.probability;
      }
      return score;
    }, 0);

    // Cleanup
    tf.dispose(image);
    
    return nsfwScore;
  } catch (error) {
    console.error('NSFW check failed:', error);
    return 0;
  }
};