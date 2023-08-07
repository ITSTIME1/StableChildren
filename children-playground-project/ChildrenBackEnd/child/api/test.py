import sys
from datetime import datetime as dt
from datetime import time
from PIL import Image, PngImagePlugin
import io
import base64

date_time = str(dt.now())


current_time, current_date = date_time.split(" ")[1].split(":"), date_time.split(" ")[0].replace("-", ".")
print(current_date)
current_time[2] = round(float(current_time[2]), 0)
current_time = list(map(int, current_time))
print(current_time)
s = time(current_time[0], current_time[1], current_time[2])
print(s)




# byte 단위로 리턴한다 그럼 해당 이미지의 리턴값은 59바이트가 되므로
# 1024 byte = 1kb
# 1kb = 1024 : xkb = 59
# 1024x = 59 kb
# x = 0.05kb
print(sys.getsizeof("output.png"))

sd = ["12,123", "124,124", "124515,515"]

for i in sd:
    print(i.split(","))