# Flash-Cards
A basic flashcard site to help me learn different languages. A definite work in progress.

- It uses the vocabulary taught in Duolingo and scrapes the web to find the translations of your chosen language.

- One side of the flash card will be the word to learn and the other side are the various translations.

- There can often be quite a few translations for one word, some of them a litle odd, so to narrow it down a little, I then compare the various translations against the Duo vocab of that language. 

- The user inputs their answer to test their ability and their mistakes are tracked in the database.

## Technologies
This project was created with:
- Python
- FastAPI
- Peewee ORM
- JavaScript
- Bulma CSS

### TODO:
- Allow user generated cards. - This is half done already.
- Audio playback for all languages - I DID implement this way back and it worked well. But the membership to the API ran out and I haven't got around to finding an alternative.
- Do something useful with the mistake tracking. - This will determine what cards the user is served up. (e.g the words the user gets wrong often will be served up more frequently).
- Add a table where the user can see all the vocab they have been tested on and their score with each word.