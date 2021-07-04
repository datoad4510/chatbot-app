# pip install torch
# !pip install transformers==3.0.0


import sys
import os

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

import torch
from transformers import BertTokenizer, BertForSequenceClassification, AdamW, BertConfig, get_linear_schedule_with_warmup
dirname = os.path.dirname(__file__)
model_dir = os.path.join(dirname,"model_folder")
# Load a trained model and vocabulary that you have fine-tuned
model = BertForSequenceClassification.from_pretrained(model_dir)
tokenizer = BertTokenizer.from_pretrained(model_dir)

# evaluation რეჟიმი
model.eval()

while True:
    print("Awaiting input sentence")
    sentence = input()

    encoded_dict = tokenizer.encode_plus(
                            sentence,                      # წინადადება რომლის ენკოდინგიც გვინდა
                            add_special_tokens = True, # დაამატოს '[CLS]' და '[SEP]' ტოკენები
                            max_length = 64,           # გააკეთოს პადინგი და დიდ წინადადებებს ჩამოაჭრას ბოლოები
                            pad_to_max_length = True,
                            return_attention_mask = True,   # შექმნას ყურადღების masks-ები
                            return_tensors = 'pt',     # დააბრუნოს pytorch-ის ტენზორები
                            truncation=True,
                    )

    # print(encoded_dict)

    input_ids = []
    attention_masks = []

    input_ids.append(encoded_dict['input_ids'])
        

    attention_masks.append(encoded_dict['attention_mask'])



    # ვაქციოთ სიები ტენზორებად
    input_ids = torch.cat(input_ids, dim=0)
    attention_masks = torch.cat(attention_masks, dim=0)

    # print(input_ids)
    # print(attention_masks)

    # არ დავითვალოთ გრადიენტი რადგან სწავლება არ მიმდინარეობს (ოპტიმიზაცია)
    with torch.no_grad():
        # გამოვითვალოთ logit-ები
        # https://huggingface.co/transformers/model_doc/bert.html#bertforsequenceclassification
        outputs = model(input_ids, token_type_ids=None, attention_mask=attention_masks)

    # tuple-დან ამოვიღეთ ტენზორი, ვაქციეთ ლისტად, და შემდეგ ლისტიდან ამოვიღეთ 0-ე ინდექსზე
    # მყოფი ლისტი
    prediction = outputs[0].tolist()[0]

    if (prediction[0] > prediction[1]):
        prediction_label = 0
    else:
        prediction_label = 1

    print(prediction_label)

    sys.stdout.flush()
    sys.stdin.flush()