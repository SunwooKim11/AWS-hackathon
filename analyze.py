from scholarly import scholarly
from scidownl import scihub_download
import os
import PyPDF2
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

tmp_dir = './paperTmp/'
APIKEY = os.getenv('OPENAI_API_KEY')  # 환경 변수에서 API 키 로드
PROMPT = '''
다음 논문을 참고하여, 어떤 주제를 다루고 목적이 무엇인지 파악하고 특히 실험 상세 설명 부분을 중점적으로 분석하여, 해당 연구자들이 해당 연구와 유사하거나 연관된 실험에 참가 할 때 참고할 수 있도록, 어떤 기기를 활용하고, 어떤 시약을 사용하여 실험을 진행했는지에 대해 500자내로 포함되게 정리 해줘.
    연구 주제 및 목적:
    사용한 기기:
    사용한 시약:
'''

def read_pdf(file_path):
    '''Read PDF and return text'''
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def openai_api(text):
    if not APIKEY:
        raise ValueError("OpenAI API key not found. Please set OPENAI_API_KEY in .env file")
        
    client = OpenAI(api_key=APIKEY)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful research paper analyzer."},
            {"role": "user", "content": f"{PROMPT}\n\n Content:\n{text}"}
        ],
        max_tokens=1000
    )
    
    return response.choices[0].message.content

def analyze_author(id, prompt=PROMPT, out=tmp_dir, max_download=5):
    """논문을 다운로드하고 요약합니다."""
    search_query = scholarly.search_author_id(id)
    author = scholarly.fill(search_query)
    summaries = []
    
    for pub in author['publications']:
        title = pub['bib']['title']
        
        # 현재 PDF 파일 개수 확인
        pdf_count = len([f for f in os.listdir(out) if f.endswith('.pdf')])
        if pdf_count >= max_download:  # PDF가 5개 이상이면 중단
            print(f"PDF 파일이 {pdf_count}개 다운로드되었습니다. 다운로드를 중단합니다.")
            break
            
        # 논문 다운로드
        scihub_download(title, paper_type='title', out=out)
        
    # 다운로드된 PDF 파일 찾기
    pdf_files = [f for f in os.listdir(out) if f.endswith('.pdf')]
    for pdf_file in pdf_files:
        pdf_path = os.path.join(out, pdf_file)       
        # PDF 읽기
        text = read_pdf(pdf_path)
        # 요약하기
        summary = openai_api(text)
        
        # 요약 결과를 리스트에 추가
        summaries.append(summary)
        
        print(f"분석: {summary}")
    
    # 분석이 완료된 후 paperTmp 디렉토리 비우기
    for file in os.listdir(out):
        file_path = os.path.join(out, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            print(f"임시 파일 삭제 완료: {file}")
        except Exception as e:
            print(f"파일 삭제 중 오류 발생: {e}")
    
    return summaries

# example
if __name__ == '__main__':
    analyze_author('JAOIX4wAAAAJ')