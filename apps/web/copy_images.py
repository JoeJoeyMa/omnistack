import os
import shutil

source_dir = r"C:\Users\84651\Downloads\openai.com\OpenAI_files"
target_dir = r"D:\project\personal\omnistack\apps\web\public\images"

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

mapping = {
    # News
    "Learning_Blocks_ArtCard_1x1.png": "news_1.png",
    "Introducing_the_Stateful_Runtime_for_Agents_on_Amazon_Bedrock-1.png": "news_2.png",
    "Microsoft_Oct_Hero_1x1.png": "news_3.png",
    "our-agreement-with-the-pentagon-1-1.png": "news_4.png",
    
    # Stories
    "Media(1).png": "story_1.png",
    "Media(2).png": "story_2.png",
    "Media.png": "story_3.png",
    
    # Research
    "oai_higgsfield_1x1.png": "research_1.png",
    "art_card__1_.png": "research_2.png",
    "Graviton_art_card.png": "research_3.png",
    
    # Business
    # "oai_higgsfield_1x1.png" is already copied as research_1, but user wants it for business too.
    # We can just reference the same file or copy again. Let's copy again for simplicity of code logic.
    "oai_higgsfield_1x1.png": "business_1.png",
    "oai_Taisei_1x1.png": "business_2.png",
    "oai_TrustBank_English_1x1.png": "business_3.png",
    
    # About
    "planning-for-agi-and-beyond.webp": "agi_vision.webp"
}

# Special handling for research_1 since it's same source as business_1
shutil.copy2(os.path.join(source_dir, "oai_higgsfield_1x1.png"), os.path.join(target_dir, "research_1.png"))

for src, dst in mapping.items():
    src_path = os.path.join(source_dir, src)
    dst_path = os.path.join(target_dir, dst)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied {src} to {dst}")
    else:
        print(f"Warning: {src} not found in source directory.")
