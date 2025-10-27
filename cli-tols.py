import json
import time
import re

# 1. The input text to be converted
input_text = """
(Years earlier) A much younger Thanos tends a neglected garden which borders a forested swamp. Having just lost his mother to illness, the young man is distraught and is trying to keep her memory alive through her beloved garden; Thanos has always had a supernatural ability to heal and grow plants and connect with living things.

My love is petals and dew
The Erthe, the wilderness too
For a fonder man, there is none
Who admires her like the Sun
Shining down so she may glow…

Amidst his ode to the rose, a girl appears at the edge of the forest; a sight he is actively trying to ignore, despite her obvious interest in him. In fact, Thanos knows this girl well. She is Vera, a daughter of the swamp-dwelling tribe known as the Fendwellers. Vera has long been the object of Thanos’ older brother Sindr’s desire, and although she has never given in, Sindr is very much infatuated with her. Thanos is reluctant to interact with the girl he knows his brother loves.

But a maid stood alone
In the trees, overgrown
And she pondered the plight
Of the rose

She drank the dew from the rose

        I drank the dew from the rose

I envy the one that she chose

        His stare and longing did grow

Then she offered me a sip,
But I dare not touch my lip
Where the serpent’s tongue hath coiled

For a man she desires,
And indeed one she would have
If I should but meet
Her gaze

A man like you I’ve never known

        Her words a womanly moan

So lonely he must remain alone

        Her dress so perfectly sewn

If you’d come away with me,
We shall never lonely be

What a travesty it would be,

        Have you never felt the touch

If our eyes should fondly meet

        Of a maid politely struck
        By a man so handsome as you?

Come away, silly man

        No, no

‘Tis a green and pleasant land

        This cannot be

That awaits us through the trees
She has led me through the trees

The Erthe, she whimpers neath my feet
Her tears, they beg me not to leave

Although sadder tales have been told,
None so truthful
Or so old
As the man
And his maid
Gladly joined

In the wake of their mother’s death, Sindr announced to Renatus and Thanos that he would be leaving Axen to join the military forces of Ealdormere in Erthe. Sindr believed his talents as a warrior, tactician, and engineer went largely unappreciated by the Axons, and especially by his father; who always seemed to favor his younger brother. Sindr blamed his mother’s death on the primitive means of the Axons, proclaiming that there are medicines and technologies in Erthe that could have saved her life. He sets out on his journey much to the dismay of his younger brother, who has always looked up to his big brother.

Thanos ultimately gives in to Vera’s allure and follows her into the woods. Sindr is none the wiser, and sets off to Erthe in hopes of one day returning as an accomplished soldier. He hopes he will finally prove himself as a son to Renatus, and as a man to Vera.
(Back to present) The Admiral and his men marched swiftly through the twilight; the banner men carrying peculiar lanterns which shone an unearthly green light upon their path. To travel by night was an unfamiliar practice to the local Axons, and rumor quickly spread that a sorcerer had come with an army to find the son of Renatus. The unit of men marched on through the night without stopping.
"""

# 2. Split the text by one or more blank lines (paragraphs)
# re.split() is more robust for handling different numbers of newlines
paragraphs = re.split(r'\n\s*\n', input_text.strip())

content_list = []

# 3. Generate a base timestamp ID (in milliseconds, like the example)
base_id = int(time.time() * 1000)

# 4. Process each paragraph
for i, para in enumerate(paragraphs):
    # Clean up the paragraph by removing any leading/trailing whitespace
    text_content = para.strip()
    
    # Only add non-empty paragraphs
    if text_content:
        # Create the dictionary for this item
        item = {
            "id": base_id + i,  # Create a unique, sequential ID
            "type": "lore",
            "text": text_content
        }
        content_list.append(item)

# 5. Create the final dictionary structure
output_data = {
    "content": content_list
}

# 6. Convert the Python dictionary to a JSON formatted string
# indent=4 makes it "pretty-printed" just like your example
json_output = json.dumps(output_data, indent=4)

# 7. Print the final JSON
print(json_output)