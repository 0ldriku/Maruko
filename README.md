# Maruko
Maruko is an annotation tool designed to help researchers and students in the field of Second Language Acquisition (SLA) efficiently transcribe, annotate, computate CAF (Complexity, Accuracy, and Fluency) measures for audio files.

## Motivation
Currently, when extracting CAF measures from audio files, researchers often use a complex workflow involving multiple tools. They may use Praat for annotation, a separate transcription tool for transcribing the audio, and tools like Coh-Metrix to calculate transcription-based measures. This fragmented workflow can be time-consuming and cumbersome.
Maruko aims to simplify and streamline this process by integrating the entire workflow into a single web application. By leveraging Speech-to-Text models and JavaScript for waveform rendering and annotation, this tool enables researchers to perform transcription, annotation, and computation tasks within a unified interface.

## Features

- User-friendly interface for annotating audio files
- Automatic annotation, segmentation, and pause detection.
- Customizable annotation labels and categories
- Cross-platform compatibility

## Getting started


1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```


2. Navigate to your project directory:

   ```bash
   cd /path/to/your/project
   ```

3. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

4. Activate the virtual environment:

   - For Linux/Mac:

     ```bash
     source .venv/bin/activate
     ```

   - For Windows:

     ```bash
     .venv\Scripts\activate
     ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Run the application:
   ```bash
   python app.py
   ```

5. Access the application through your web browser at `http://localhost:5000` (or the appropriate URL).

## Usage

1. Upload an audio file or provide a URL to the audio file you want to annotate.
2. Select the appropriate annotation labels and categories for your research.
3. Listen to the audio and make annotations using the provided tools.
4. Save your annotations and export them in your desired format.
5. Repeat the process for additional audio files.

## About the tracks in annotation step
Track 1 is the waveform of the audio.
Track 2 is the track to annotate small segments of the audio. Small segments can be clauses or anything user wants to segment.
Track 3 is the track to annotate big segments of the audio. Big segments can be setences, AS-units or anything user wants to segment.
Track 4 is the track to annotate pause duration. Currently, Maruko supports automatic pause detection. The user can click the "Auto Detect Pause" button to automatically detect the pause duration. The pause inside a small segments will be labeled as "M". The pause between big segments will be labeled as "E". The user can also manually annotate the pause duration by clicking the "+ PAUSE".
Track 5 is the track to annotate accuracy. 
Track 6 is the track to annotate dysfluency.

The annotation for track 5 and 6 can only be done manually by the user currently.



## Experimental Features
 
### Gemini API Integration
Now the Gemini from google offers free api to access the LLM. I intergrated it to the segmentation step. The user can click the AI refine segement button to let Gemini to segment the transcription into clauses or AS-units. But the precision is highly depend on the prompt. For use this, user should get the API from gemini, and input it into /static/js/gemini.js file.

## Supported CAF Measures


- Syntactic complexity
  - Mean length of clause: The mean number of words produeced per segment.


- Speed fluency
  - Speed rate: The mean number of words produced per second, divided by total audio duration.
  - Articulation rate: The mean number of words per second, divided by total phonation time (ie., total speech duration excludingpauses).

- Breakdown fluency (if the user segment the small segment as clauses)
  - Mid-clause pause ratio: The total number of unfilled pauses within clauses was divided by the total number of words.
  - Final-clause pause ratio: The total number of unfilled pauses between clauses was divided by the total number of words.
  - Mid-clause pause duration: Mean duration of pauses within clauses, expressed in seconds.
  - Final-clause pause duration: Mean duration of pauses between clauses, expressed in seconds.

### CAF Measures on working
- Accuracy and Dysfluency
    - I have no idea how to auto detect the accuracy and dyfluency. The user can only manually annotate the accuracy and dysfluency. But I will make the function to computate accuracy and dysfluency soon.

- Syntactic complexity
    - Mean length of noun phrases: The mean number of words per noun phrases. -> maybe can use psyca or stanza.

- Lexical complexity
    - Measure of textual lexical diversity (MTLD): The mean length of sequential word strings in a text that maintains a giventype-token ratio value. -> maybe can use psyca or stanza. 
    - CELEX log frequency: The averaged logarithmic frequency of content words produced in a text based on the CELEX corpus.
    - Lexical density: The proportion of content words to the total words produced. -> maybe can use psyca or stanza.

## Technologies Used

### Transcription
faster-whisper -> currently set on CPU mode, if you want to use GPU mode, you can change the code in ....
Gemini API

### Annotation
Wavesurfer.js



## The CPU usage in the transcription step.
In my setup, for 60 seconds audio file, the transcription step will take around 1 minute to finish.
The transcription step will take a long time to finish due to the low CPU spec.
If you want to speed up the transcription step, I recommend to use the below Google Colab notebook to generate the transcription file.
The Google Colab offers free GPU runtime. The transcription step will be much faster than the local CPU.
[LINKHERE]
You can load the transcription file into the Maruko to continue the annotation step.


## Roadmap

- [] Refine the file management system.
- [] The feature to export the data into csv file.
- [] Make the annotated json file can be converted into Praat textgrid file.
- [] Support for other languages than English.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request. Make sure to follow the existing code style and guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or inquiries, please contact [Your Name] at [your-email@example.com].
