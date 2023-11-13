import openai
import json

import ast

class Refactor:
    def refactor_change_code(self, file_changes):
        try:
            print("refactoring")
            openai.api_key = "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"
            refactored_file_changes = []
            sample_dictionary = {
                                    "filename": [
                                        'full file code',
                                        'snippet 1',
                                        'snippet 2',
                                        'snippet 3',
                                        'snippet 4',
                                    ]
                                }
            
            refactored_sample_dictionary =  {
                                                "filename": '''full file refactored code'''
                                            }
                                        
            explain_system_message = {
                "role": "system",
                "content": f""" You are a world-class software developer with a knowledge of all programming languages. 
                You carefully examine code snippets with great detail and accuracy. Refactor a code according to the instructions given below:
                1. You are provide with full code as well as the snippets of the code which needs to be refactored. Also refator the code which is asked do not refactor or chnage the code which is not there code snippet list.
                2. You have full code have look at and understand that in detail. Now refactor only the snippets which are asked to do and it should not change the working of it.  
                3. There are many kinds of code smells that you can look upon in the code and remove smells. You can remove smells if you find them in the code but the working of the code should not be changed.
                4. You can change of the function, class or variables if they ar e not realatable to function or class and not according to the naming convention the language. 
                5. Format the file for proper intemdation after the refactoring and also remove unnecessary comments from te file.
                6. Keep in mind the indentation of the code provided to you. After refactoring it should follow the same indentation as it was in the code provided to you. Keep this thing serious because it can cause error in a lot of programming languages.
                7. If you are not confident about refactoring or optimizing the code then do not do it just keep it as it was before.  
                8. Also check if the solid principles for the software development are violated then refactor it if you can solve otherwise do not change it.
                9. In some cases if you feel confused about refactoring then do not change the code.

                These are some points that you need to consider while refactoring the code.

                """,
            }

            for file_change in file_changes:
                explain_user_message = {
                    "role": "user",
                    "content": f""" Refactor the given code snippets to make them smell free and more optimized. 
                    If a snippet is correct and does not need any changes, Just don't change it. 
                    I have given you the sample dictionary which I will provide to you as a input.
                    Now in dictionary the key value is a file name and value is the list.
                    Now the first element of the list is the full code of the file. Now understand that code properly and 
                    from second element i.e. index 1 all are the code snippet that are need to be refactored in the full code. 
                    First find the code snippet in the full code and then do the refactoring. While finding in full code match it exactly.
                    There can be a multiple snippets to refactor in the full code. And do not change the code other than that in full code.
                    What will the dictionary look like is given below as a example: 
                    ```
                    {sample_dictionary}
                    ```
                    Just take up each snippet and refactor it according to the instructions points given to you.
                    After you have refactored all the code snippet in full file code then give me that refactored full file code 
                    in the format I have asked for. It should follow the indentation of the file as it was before in non changed file.
                    And given a response according to the Python dictionary format is given below:
                    ```
                    {refactored_sample_dictionary}
                    ```
                    In the dictionary add the refactored full code and if you havent refactored the any code snippet in the full file code just 
                    give me the original full file code. And remove all the code snippet and just give the full code as the value of the filename key in the dictionary.

                    Now here is my Python dictionary for refactoring the snippets of the code in the full code:
                    ```
                    {file_change}
                    ```
                    Give a response according to the instructions I gave you.
                    Please generate a full refactored code donot stop in between. And give me only the dictionary as string so that I can convert directly to python dictionary.

                    """,
                }
                
                prompt_messages = [explain_system_message, explain_user_message]
                print("please wait refactoring the file")
                llm_response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=prompt_messages,
                    temperature=1.0,
                )
                print(llm_response['choices'][0]['message']['content'])
                code = llm_response['choices'][0]['message']['content']
                refactored_file_change = ast.literal_eval(code)

                refactored_file_changes.append(refactored_file_change)

                # print(type(llm_response['choices'][0]['message']['content']))
            print(refactored_file_changes)
            return refactored_file_changes
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return []
