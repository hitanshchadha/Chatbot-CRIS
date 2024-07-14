from groq import Groq
from dotenv import load_dotenv
import pandas as pd

load_dotenv()


data = pd.read_csv('HITANSH_edited.csv')
a="ABR1317"
start=True
if a not in data["CREW_ID_V"].values:
    print("Crew ID not found")
    start=False

client = Groq()
def query(query):
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {
                "role": "user",
                "content": query
            },
            {
                "role": "system",
                "content": "Crew management system of Indian Railways. "
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )
    return completion.choices[0].message.content

bot_name = "Sam"
count=True
def get_response(user_query):
    global count
    if(count==True):
        global a
        a=user_query

        if a in data["CREW_ID_V"].values:
            count=False
            return ("Crew ID found")
        else:
            return ("Crew ID not found")
    elif(user_query=="quit"):
        count=True
        return ("Chat ended")


    else:
        prompt = f"Identify the relevant data field from this query with respect to Crew management system of Indian Railways and answer only the required data field in one word : '{user_query}'. Possible fields are: {list(data.columns)}."
        response = query(prompt)
    
        if response in list(data.columns):
            Answer=data.loc[data["CREW_ID_V"]==a][response].values[0]
            prompt = f"User asked: '{user_query}'. The user's {response} is {Answer}. Please write it short and concise."
            response = query(prompt)

            return response
        

        
        else:
            prompt = f"User asked: '{user_query}'. if it is greeting or farewell, please respond accordingly. else respond information not found"
            response = query(prompt)
    


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        # sentence = "do you use credit cards?"
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print(resp)

