from deezloader import Login
import sys, json

value = input()
print(value)

my_arl_token = '501d959e703586dbf9d3d8e7907ff11249bdc180da3a5adde986d8d5c7a91840697126e8d74d175f06599ca457fd8beb35e9e229fd984d184b5be2b7e4f3a9ce3f9c28a923ecc6dcbc8b312cd838e8c2d1af8ff5396fdc2c5ea41796cf1c6b6e'
downloa = Login(arl = my_arl_token)


downloa.download_trackdee(
 	value,
 	output_dir = 'C:/Users/79686/Desktop/muzBot/musics',
 	quality_download = 'MP3_128',
 	recursive_quality = True,
 	recursive_download = True,
 	not_interface = True,
 	method_save = 1
)
