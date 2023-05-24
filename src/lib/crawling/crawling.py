from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
#chromedriver version : ChromeDriver 113.0.5672.63
from dotenv import load_dotenv
import os

# MySQL 연결 및 데이터 가져오기
import mysql.connector

load_dotenv()
mydb = mysql.connector.connect(
    host=os.environ.get("MYSQL_HOST"),
    user=os.environ.get("MYSQL_USERNAME"),
    password=os.environ.get("MYSQL_PASSWORD"),
    database=os.environ.get("DATABASE"),
    port=os.environ.get("MYSQL_PORT")
)

mycursor = mydb.cursor()
mycursor.execute("SELECT name FROM stores where address is null")
result = mycursor.fetchall()
print(len(result))

# Selenium 웹 드라이버 설정
webdriver_service = Service('./chromedriver.exe')  # 웹 드라이버 경로 설정
webdriver_options = Options()
webdriver_options.add_argument('window-size=1600x900')
driver = webdriver.Chrome(service=webdriver_service, options=webdriver_options)
#URLS 검색후첫링크,주소값,바로나온주소값
VALUES = ["C6RjW",
        "#app-root > div > div > div > div:nth-child(6) > div > div.place_section.no_margin.vKA6F > div > div > div.O8qbU.tQY7D > div > a > span.LDgIH"
        ]


# 크롤링 및 데이터 저장
for row in result:
    name = row[0]
    print("name : "+name)
    driver.get(f"https://map.naver.com/v5/search/{name}?c=15,0,0,0,dh")
    try:
    #검색 후 여러값들이 나오는지 확인
        driver.switch_to.default_content()
        WebDriverWait(driver,1.5).until(
        EC.presence_of_element_located((By.ID, "searchIframe"))
        )
        driver.switch_to.frame("searchIframe")
        WebDriverWait(driver,1).until(
            EC.presence_of_element_located((By.CLASS_NAME, "C6RjW"))
        )
        firstlink = driver.find_element(By.CLASS_NAME, "C6RjW")
        firstlink.click()
    #첫링크 이동 후 주소 가져오기
        driver.switch_to.default_content()
        WebDriverWait(driver,4).until(EC.presence_of_element_located((By.ID, "entryIframe")))
        driver.switch_to.frame("entryIframe")
        WebDriverWait(driver,1).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, VALUES[1]))
        )
        address = driver.find_element(By.CSS_SELECTOR, VALUES[1]).text
        driver.switch_to.default_content()
    except:
    #검색 후 여러값들이 나오지 않는 경우 바로 나왔는지 아니면 없는지 확인
        try:
            driver.switch_to.default_content()
            driver.switch_to.frame("entryIframe")
            address = driver.find_element(By.CSS_SELECTOR, VALUES[1]).text
        except:
            continue
        
        
    print(f"address : {address}")
    # 주소를 데이터베이스에 저장
    sql = "UPDATE stores SET address = %s WHERE name = %s"
    val = (address, name)
    mycursor.execute(sql, val)
    mydb.commit()


# MySQL 연결 종료
mycursor.close()
mydb.close()

print("크롤링이 완료되었습니다.")
