from time import sleep
import requests
import os
from decouple import config # type: ignore

class Voice:
    def __init__(self, language: str):
        #self.language = language
        self.location = "northeurope"
        self.token = self._get_token()
        self.voice = self._get_voice(language)
        #self.outfolder = "output_mp3"
        self.time_since_request = 5
    
    def _pause_for_retry(self):
        sleep(self.time_since_request)
        self.time_since_request *= 2
        
    def _get_key(self) -> str:
        return config('AZURE_KEY')
        
    def _get_token(self) -> str:
        print(f"location: {type(self.location)}")
        token_url = f"https://{self.location}.api.cognitive.microsoft.com/sts/v1.0/issueToken"
        headers = {
            'Ocp-Apim-Subscription-Key' : self._get_key()
        }
        response = requests.post(token_url, headers=headers)
        access_token = str(response.text)
        ##print(access_token)
        return access_token
    
    def _get_voice(self, language):
        url = f"https://{self.location}.tts.speech.microsoft.com/cognitiveservices/voices/list"
        header = { 'Authorization': 'Bearer '+str(self.token) }
        try:
            response = requests.get(url, headers=header)
            response.raise_for_status()
            json = response.json()
            response.close()
            for voice in json:
                language_list = voice["Locale"].split("-")
                language_abreviation = language_list[0]
                if language_abreviation == language:
                    return {
                        "gender":voice["Gender"], 
                        "name":voice["ShortName"], 
                        "language":voice["Locale"] 
                    } 
        except Exception as e:
            print(f"ERROR: Unable to get voice: {e}")
            print(f"Retrying...")
            sleep(1)
            return self._get_voice(language)
        
    def speak(self, speech: str):
        url = f"https://{self.location}.tts.speech.microsoft.com/cognitiveservices/v1"
        header = {
            'Authorization': 'Bearer '+str(self.token),
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-24khz-160kbitrate-mono-mp3'
        }
        requests.post(url, headers=header)
        data = f"<speak version='1.0' xml:lang='fi-FI'>\
                <voice xml:lang=' {self.voice['language'] }' xml:gender='{self.voice['gender']}' name='{self.voice['name']}'>\
                <prosody rate='0%' pitch='0%'>{speech}</prosody>\
                </voice>\
            </speak>"
        #data.encode('utf-8')
        #time.sleep(1)
        try:
            response = requests.post(url, headers=header, data=data.encode('utf-8'))
            response.raise_for_status()
            outfolder = "output_mp3"
            outfile = os.path.join(outfolder, f"{speech}.mp3")
            with open(outfile, "wb") as file:
                file.write(response.content)
            print(f"SUCCESS on {speech}: {response}")
            response.close()
            self.time_since_request = 5
        except Exception as e:
            print(f"ERROR on {speech}: {e}")
            print(f"Retrying after {self.time_since_request} seconds...")
            sleep(self.time_since_request)
            self.time_since_request *= 2
            return self.speak(speech)

        
    