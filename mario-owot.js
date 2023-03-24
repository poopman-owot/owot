bufferLargeChars = false;
var charImages = [];
var globalTickItorator = 0;
const mirroredCanvas = document.createElement('canvas');
const BlockImageSrc = {
      nullPlayer: ["data:image/png;base64,"],
  grass: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAIAAACU62+bAAAChUlEQVQ4je2Uv46VVRTFf2ud7w6aIWooUWZaGG0ojcO8gQmJWon2xsCbGBNBX0AKQ3iKYRJbCrhjzTCJJaFiuN/ey+K7xCew8zTnZGftdf6ttQDAbIcRkpb1dt7Wh5Yix4YG0FBXBhQsWDGiUtSJhLK0BnCMEkNhASIglSKEDRC7Nbh8yKdnEXSQkGLTzeNDPdv36V4OXqAg/Piw1/sT90+co6jzzckgFXj0hUgenBA3TY5EK+4HJ4Du3bly/+HrMHP3CKEmvx3T3P3uI0DxLw9fCVB+/PYDI/3w/YdT1PjX31+ZNLl35wp0ZEl0lTOYZpUzlNKTn7784+mfg00Y0Iojvr55C4eOw6OnT5QJ11c3P3evdPzz7WQGHAGtANKUlMlspm7xXrHBcs9TUgu6DDBarSzFit1pRnKx99km4eV6Z3IAtfLJjbfA+Xpn2Qolk5g7Y6jVQW4YLlcLRygojlqUSyHVkemWLJYrtUcPiSJEREUkRo8gGPsHbwG6ztaXX/61izLFI6khzteXgKF0wKOZTTYUrIQnzZu5hqdJmRXBVltEBphlp3O+3g0zkipjjEpcAuhFcKgFUIKOyZSW5IUqAXvagmICRJQmIxOigKJ3n2MoV96ZJEqyd3Bx7eB1QqNW4oUYhql2hv/Fegwxq8KIaqG8ev3NJIOUltRqSzItqSmF0bak2CFRT+pspAHEAqwWOPK1G2/CODu9dPZ8Z/to2rhjrZJqK2mIWyWcqEl7I9oB3Ij47+e7RZt8fP0iQZosqWgp56fvpy0mABoMInO0nEST3D07MaDO1BmMpFtxlp4EKTR68Wy1qMZLCrUStM0biMeSVvOIqcFKEpbp//3wn/jhH6ItFkhCJ+yEAAAAAElFTkSuQmCC"],
  dirt: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAIAAACU62+bAAABnUlEQVQ4je2TTVKUYQyEn+68QFl4AhXcAuVVPJuX8ggyuBamyrUrYL6kXcxY3sEyy1QnlfSPvn753AFiGBRBlrUpIQJGQDRQTsYdThUlub57ubr7lTBolJgkAGV6nPJfrKvEpg4VNSD53c3zkkHKSBqNJZmRNLRCjS0pdkg0S5ODVEAswBqBI1/dPod6fLh4vD8HoaCDJ9ZZ0mMlA/GohRMNGR/EOIAHEf+8v2zG5P3NS4K0LKkZKfuHNxmLBcCAQWSLjpdoyTObEwOarElRyYziHGcSpDDox7ezJhKWjmQnCObEsAswbBXTxZkkLDMracBRG6BGoxybHXsyVPJy/emQ8LQ7Xw6gUT7cvgL73bkjACVLbJMqjSbIA+V2j3COPMbRiHYrpCcyM5JFmDjjmpJoQkR0/KymgqA+3r0CTD/u3j59v0RZcSVdYr+7AEqZgGvYTA40nAkvbYety2spm6KTtEBkgE12JvvdZdiQ1KmqTtzij4cFGgG0YGKyMpJ8XJWAvU6gmAARrWVkQhRQNMrRvND/8/A/D/9wHn4D8bYkkq8gB4UAAAAASUVORK5CYII="],
  grass_edge: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABHElEQVRIic2UMQ6DMAxFfxADM2OvwMSM4AYdGTlCrtKFIzByC1DnTlyBkZktHUggIQRwpEq1lIHYef6OHRgAAZox86MjAgoTFBCzA51cUnmANj8/cOFnAAS4DCp7+2Dd49APLOXwKhZSjgDPtyX3Vr/a77AtQDAZsCRrphXOq9hIVjeTqt1QwLrXU7Sft1VbmWZLJZrPghRAqAfr9khmjEOEMs0MCNrcuItbbTxKoCzcZwWAcYjOiWtre7eCIwiv4qWtNbEEYCuDV/EG2gPGITqVv7sLBoCR30KZZgaI/ph25gVQ3XIC9ICfKPAC6Kr0TgVHQZeT6KPABbUG6Y5ddoGi5s8G6ZHMpCHyVuAFcA2S8UujDBBZwa1B8rEvkoxvH/sVm00AAAAASUVORK5CYII="],
  grass_edge_flipped: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAA+ElEQVRIidVUuRGDMBBcPASOCWmBiJjBXSikBKpRCYR0YY1LcAsOHZPhAITE6SRLDA68kUanvd17IIOLmbnzInOI9xS6STCnEjUuwejYhtlji5xV10SpAKxnodh47lWVCn1XQEpNtNysd31XIGMd3JagDTm8t7Mdcx0Qsqib9fRwnoq6IQnGFoDaPQCAspog0ICDdwpGOYzcKH9HWU0AgNfzShIAu85S2ASKZQrwNS7OgVnnANnnZCshtmkU4W8hJYGu72cOfALnlWB3OKWcaAdagCZnE4Q2z+sg1jZNzvYgBX+0SFokagqHHBxdJPevHAA3qfMW6Sg+Ri9O1En56lkAAAAASUVORK5CYII="],
  grass_edge_both: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAC8UlEQVRIiYWVP29cVRDFf2feMyAZQRKJJgGlNUnlVICd+AtAA7EUBPsBkFj4JmnWBQ00UBFa6ChgYwgVDbFo+SsKOoRi43fnUNy3b/94nUyze+/dM3fmzLlnxdnw8jKQEnu+RkIuGKQzwG8Xwf2xBfKwYwQk2oN2AC8B+3RugJyhoDS4LWCjqHst58WXr8LJU/N16eDOIRRQzMqNPvfq7fdu1s+D6cCIxrs4BW9PiSJSQrdyTYIZeDJlPLrQt9My+exv+HAP3MHtQyDgVhJLNz96GhrBR98xHl3qeQtE8sHoBfj4e8Itc1JihYOvXoFPfmB853kA3rqxB2FI88WPh+jfginw+Wv1Iu6vVJAJ/xwPS0mQxirIyfvvXMQH94mDB/W3alYSLMT+9g52AaBx8Ob2LigZv3uB90YXYfIAXPoE927OyVuIMARGBATc3t4BgqBjPHoOQHMOJlMAxqNLw1aJQptBUSJX4vZv7HLl5UdAMvn0657EyXQJuL+9U0vPZhDM1WvH/HK0AVn47ehZFKU/qTPRKhjA0VDCSOaUChBBq47sOmBByovAYQruUARO88fRJqarL7GYpmmGCs6NIiBNYFonkohe2jZ8c/cNB9Qvl68fn0kQiMBgYUAWOXvWqqQ+tgIbkgpygGeu0gSUJNwLaclWFhOoJ07B5a1jWlXO1beT6h+TXPjz4TMDcNaOHITBFtmK9ClSJc+hRRLP66S3Mp0SaUIb2IUMYeecA60kmFcTJAIHfz3cpJAE5srWCTZIbUV2LqybAiSD1tzhnqyQaBVkdjMStcTBLOrMa6lGqJ/Krz9tUDDSE4TkmKuta0xQaNioGggRLFjauhZmflAcRIqkofMJL10/4cWtY5KoCcLrhTDzg2hBTgjV+RuIZKA/zxFSiYIMLokVkIkUiOqT9QKqEtcJqfqBgIar1/6rh70f/P7z5sDPwh/nWRIf5weS0PTu68ZiHQ3CZER1ZgLTEQRKQyNsiHJO//BkPwD4H7d9ZisvdnzXAAAAAElFTkSuQmCC"],
  block_dud: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAjklEQVRIie2TLRKAIBBGvyUZjRzBI3kMI5Fo9BgcjWikaXLdwRWVZOAFhr/vsQMD4WTDN4gbAFtcE/o4AAAWn4pJFyJLSIafgprEAPgclpiqVC6oPZ0Fk+94QlzQBW3tUsE8WnWjCxHzaHVBTi65C98KDonWfy14y08EpafTkPv5M1UWQCQGVd+50Wg0DnZgcTNbYZg2kAAAAABJRU5ErkJggg=="],
  block_dud_stacked: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAoUlEQVRIie2UPQ6AIAyFX50cHT2CR/IYjo6Ojh7DozE6sulkbaAg4qIJbyDl5300kJZwacczEQ8AdrNZNKYDACyTjTrH1TCEpPnOqEEqAI/NUlWWywXk3s6AYap5QTyQJ23Py2DuW/XguBrMfasDXLmQkDkIOCFanAxI1UcAsa/TJM9zMWUmQCQmWeX8+g1KPyj9IAg4IVqcDEjVRwD/7gcHDvZlthSRdyoAAAAASUVORK5CYII="],
  block_stone: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAtklEQVRIie2TLRKDMBBGXxgOU1lZmSPkKEgkEslR9hhIJEeorKyjpmmT5Wc2Pk9kJjN8376EiePPRhnutwDb8/U2pdZlBsB7D+BMBTGk8d7T6PC6zKeBFBEBoLFoX9Gmm3SyxWJXkHK7Pw6LonrEfAQRQUQIIewNrLpHZAap3tnf0EfI7kDrHQU0WYGI0A8jAOPQ7z6OA9LS1jLlCgdsXdcVB6dpAr6XGDel4WgA5U9Z5yuVSoUPhLlJ1dGKVEQAAAAASUVORK5CYII="],
  block_stone_stacked: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAw0lEQVRIie2ULRKDMBCFvzAcprKyMkfgKEgkEslR9hhIJEeorKyjpqGb8DMbZIdPZGZn8t6+JJN1/JjJwy0LMD9fb5NqGgcAvPcAzmQQRCnee4pUPI3DrkAjIgAUlthHlLrQnS0pVgaa2/2xaRSiB8xHEBFEhKqq1gmscbeIEuh4e6+RHiG6gzTeliAlMhARmrYDoGub1ebQQJuWli5HOGCu6zpb2Pc98L3EUOSKQwLI/8qL3qnimgcnuebBNQ/gL+bBBwKNk6mmiP8FAAAAAElFTkSuQmCC"],
  lava: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAwklEQVRIie1RuxXDMAg8aRKVHodRMopHUZlSY6h0mTIlHSlkbPyRbKcW7/HgwXGcEPDAmCBP8M0hJsihlwFRvyJb8jiDMyCfLwsnCKdCErHdwqnkTAXDBIEOKFg9YiVaIq0K1Z3d8I6r3AFAoJJPpm5rgQBn36vN/dCm95rjWII/G27aWFwX+EB1qVpvKXO1L9tbjWQhaG2pkU2xoSDPcbio+33jDGRvMRhMtk+obQx0PO7pDf41fw3pBJ2gE3SCe/YDDAGDDOYPd1MAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAA4ElEQVRIie2RIRKDMBBFXxhEJUdAcgxkZY7CUXoUJDJHqIxEVlbGpQJ2SDeBUs+fyQC7/7/ZDYZEHqK8d2D4oWA3Px7i6x1icMTgiCkMYFTfIiPh1uXNuQcP2MQn040QLZh6bdA+coAON+9A87zhe6JA6uAW6tTngLuDkIw+NbesboIlzuNiaG1pS6Vhfa4T1xLO9lf1DD4sEKNvu7Unwom+Vjgy70GzCY4koRT2F6CkStNh+f9+J+BVv5LwPG6Qbj0aDHC3W8+zs4LQO90oqC4VzwRF1W/LBbgAF+ACnNMH7GhYdtG9VBQAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAx0lEQVRIie2RKxLDMAxEXzIFPYZhjhFY6KMGFvoYhoGFhWYqSOTKbjNJU2rNeKzP7sqSYbXkEc5Y8oglb/kAESRS5vrrRAeQwvcXqEgEcQFcWPxPYED05NiQU0Aez5QxWUQTEwuhuKuaPVrvji7vPpXxLcA8Qmfncb4EzRUJlh3k+gj9L2Ql2bsYwZJUsBayeefNCM6/wTV5SwyqHZyxi+2w1SUaf1jjQV+QPFLPrl82sG+HR6iFdWd/76DfhzSBJtAEmsAxewGFII4+/iEN/wAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAzUlEQVRIie2RIRLEIAxFH50VK/cIlRxj5coepUfpUZCVPQaysnIlLis6dAMDnc7U8hUk+S8JwE2Zq4UeRN9t9LosoRVzHiQsyPYNEpb9nAA1JAeWzBryCAPCCAGEaTcF9hjA/IZ+gtf4TMebwAMmDGnH1UE/pLWzg08lZvQuuXF1tdf51x4TxGIN0bHSZAcgT5bueedYY/L/rY1aW8l4ED3i2d4lddpU2zPKF87Gg3jAZglLqthIQywX3kCbSyteApypu2NugAZogAbQ+gHwQnXdpLwHngAAAABJRU5ErkJggg=="],
  coin: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAnElEQVQ4jd2SIRbDIBBEP30VyMhIJEfIcXq0HCdHQCKRyHVbEeBBSSoqO2r3McMuzBhm6Edv7hoFSFkG9rrYgVsFWolL8tPIeKz41wFgnv3Bkjy4SJYithaim3dOWVSCU5FSCyrBKdDqsG8K6OPi0V/xv4KLr/x5QkXzQQTljMnkAcDgdF1FQu3PWPSYwhf2bSCUDDXuEN1eeHMpbztzUuZsgTtQAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAgUlEQVQ4je2SKw7DQAxEp1VB4cJCwz1CjpOj5Tg9gmGg4cJhE5AEtOttpeI+yWzGH3mAHB3VccnE0QgAeJR7p7lm4hIVJSp8mc5pQ8OOrXt9QdEouikaBUB0ky/Tyz35hA/8Db8guomESHQ/AIBbaltt2DEN35Eh1Pk50vSm91VONq+cOHWZG8EpAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAaklEQVQ4jWNgwA7+QzEGYMSm+MWHHwwMDAwMEgIcGGpYsJki8EIDh8U4bPgBsYCBgwNTDRMuxQwPFBhuLLBgYEDzC7oGhg9wHdgBhgZCYERqIDnisCYNhgcKMAaGFFYND05I4NSAC+BM3gCpkx06JvT58QAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAd0lEQVQ4jeWSKw7AIBAFp1UrkZXI3v80lUgkch010A+79AKdhGDey7wEwKe2Y1i8cC4KwBbEZFYvHEQA0CN227QAQNG7NPIsXFOCCEUVYjIWY+jhq/RheM2ZzfqlYaTmolW13Uc0f+rT4OF+vva6yJ5mGVsap3RObUhdS8NqJhgAAAAASUVORK5CYII="],
  
    pipe_opening_left_h: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAAzUlEQVRoge2ZvRHCMAxGZS6FR8gIlJSMl7EyQsqMkZLSHZRIgBoglu7yvso/hd59jhWdXMTqLn1VTp0DvgmAIvrcF7Uz/zHK5G+FOwDAYGaXDhEnOw53AACTB7Zb2yXIWOtzooayJHAAgMHbMOf2q9bPy9u5xTsAQCjAWOvBHUgBYPKAufvO3f1KXn25JnAAALce2O1fcFXjlsABAMgDAAAAQCzAHA0gAET3CekPZACI7ROSBzIA2G9A14G8FwDQQ7wXZAAoL3Pejo8H8ADVLSIL/UaSXwAAAABJRU5ErkJggg=="],
   pipe_opening_right_h:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAA60lEQVRoge2ZsQ3DIBBFPxaFy5SM4NJlRvBYHisjuMwYHoGOFJHDRYQoQpiLxP/VFxK6pzs4EBg8FdBW5jBD48CJCGDwrf5rxUiL8Ndo1TNAAIsV77WWfkE9zZ+H1TNAAIMNQe5L+Gh375MJNeQu48urZ4AAdp88HGJNcI/WzWM6o1C59aSeAQIMbqxX5yIA1egEAGDlvgcA3M4JlOsp6hkggIFHkEcBNuEz97gSybOA94G/AmAfIAABCDCcte9/B1AWASwW5N+IGkg9AwSwSR/gO2FvADYZYR/oD6BxzVMAZRHg+MPl33G/AA9v+SEnPS7n5QAAAABJRU5ErkJggg=="],
    pipe_body_h: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAAa0lEQVRoge3ZsQ2AMBBD0X/oBmcsRqDMGJSU6WAMF/e9QJ6syEUCZnoK+JKAI3m4AIDmzALiDQgobndgOKCed3sHZgOK7Q4MBzQrC4g3IMAdEOAOCBAgoLmygHgDAnwfEOAOCBAgwD8jAcb8VZ0RTd6heDoAAAAASUVORK5CYII="],
    pipe_body_left_v:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAQElEQVRIiWNkQID/DAwMDAwNUJ4HhHqh8YOBgYGBQYKDAyJwASpvAKGYGCgEowaMGjBqwKgBowaMGjBqwGAzAADJ9AU3O5nsOAAAAABJRU5ErkJggg=="],
    pipe_body_right_v:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAANUlEQVRIiWNkOMHwnwEZ7IDSHmh8GGiAsxgZGBgYmBgoBKMGjBowasCoAaMGjBowasBgMwAAQpcEQPSGm0IAAAAASUVORK5CYII="],
    pipe_opening_left_up:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAeElEQVRIiWNkQID/DGQAJnI0IQNGuM0noCIGEOrFjx9YNUhwcKDIU+wCFjhrB5qMBqqNcHABKm7AQR0XjBowasDgMACRFxpQJWBpHZb24QAtz1CxPCATUMUFMABxCSwsPCDUCw1IyQMvF2BhYkAlF4waMGrA4DAAAOkbE4XueDaxAAAAAElFTkSuQmCC"],
    pipe_opening_right_up:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAaElEQVRIiWNkYGD4z0AeYGRgYGBgIlMzkik/cLjgApQ2QOPDgAWEotgFLBgmw8AOAnwGKrlg1IBRAwaHASy40jhDAwE+tVzAyEB+iUQdF7AwnEATgYWJBxofBhBhQZ0ycdSAUQMGhwEAaD4NOyzt9EoAAAAASUVORK5CYII="],
    pipe_opening_left_down:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAe0lEQVRIiWNkQID/DAwMDAwNUJ4HhHqh8YOBgYGBQYKDAyJwASpvAKGYGCgEowaMGjA4DGBkgOWBgXIBC4YILDdWQOkLaPI7oLQH1V2AXg78gJYDBhzYdY6WB6MGDC8DEOXBCagINI3D8gI6gNWRMHmquAAGyCqZKHYBAOlPFe3p4mG2AAAAAElFTkSuQmCC"],
    pipe_opening_right_down:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAZElEQVRIiWNkOMHwnwEZ7IDSHmh8GGiAsxgZGBgYmBgoBKMGjBowOAxgZGBAywv0dgELUu5CBQ04aOq7wIOAClzyDVRywagBowYMDgMYGX7gKA8uQGkDND4MWFDNBeSXSNSpnQGv4w1P8Cv0EgAAAABJRU5ErkJggg=="],
    bush_top:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAkUlEQVRIie2RwQ2DMAxFHygrMQbihNRFMgVD9FqJEyv0ykAc3UNDGsAJkXr1k74U82THKGAYhpFHQqp8cxLgQzXVeRflLvqkZULCkKx3Ue6iA9bTygXvouzQufGtKtP6zrMhat4I/vp9eY6/2iMNW+HJ1uNty2uM5+ExA1AekKA1l39ByWH9kOoNcrT/NNuALx/C+mNTTrW8aAAAAABJRU5ErkJggg=="],
    bush_left:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAj0lEQVRIie2RwQ2AIAxFv8YLMziHYzAOU7iVuzBDj/VAECigwMkDP2lCKK/9LcDU1NTUX7QMMBzzPQUcaKKbE9iaYQ/qNNFSwMEePFo7+jBgXGBQOUo74GRO/d61PoKwbImwK5U9kw7CvFFXS/ScZZG1bu4blgU4y0ZQCQbCCOk/N36VdNANewfFxY05GNANeikr/DzWeKcAAAAASUVORK5CYII="],
    bush_right:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAsElEQVRIie2SsQ2EMAxFf1BWyhiI6qRbhCmyyElXITa49gaiDAU4crCdQJ8npSDmf778ATqdTscmnecW7iIE5vMpirmKz2ISjmwakVomPotJGAD8W9/lBiQO90WcQRU/MtuQ1PNDwpwbMVvx1kCkMBY6VNNxk6Mlkchha/w01MgqEgGAqyfgjPp1OwFPQVCaaOxg+bzKiwCzWmFAYmFiUBhw0fT+lm9el6ktkURCXGEHvPM3p05u5YMAAAAASUVORK5CYII="],
    lucky_block:["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2klEQVQ4jZ2TLRLDIBCFv2QikEgkMseorKzsUXqEHiUysrKyR0BGIiPXpaID3aTQv28GRJb3eDthG54s/EaTN2CJs+TKPO7eKsfLxGmIAE2jxTb2mH6qCiV4pptbmXSpmMQ6yRZjDRLIJgBtLn4QA8RZXhJ2UO7ZWbMS1ugA7OGKhB6jRN/S6gQSPBJ8vjUtnSrVVwk+kdrZiqsGEvyqnZLwrcH2j5hC9ERb/PoD2UA/DgkeZ01e+nZ9Dh6zsJyPjsO+3ueW8fJ4TKchPofpfHR1RQE9TIm/xvkOSc5h/eU3f7EAAAAASUVORK5CYII=","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAwElEQVQ4jZ2TIRKEIBSGPxyD0Wg0eoyNG40exSN4jI1Go3HjHoFoJBppbnBABpGV/WYgPPh/3gOe4GAjDWEnYFOrtivr9Igqp3mhHxWAEK64VE1QUDTLKTZ0Ff2oyEwgJlarPg1DFlR54hgZnGsOpQxQlYUdhhygbN8QKEHLmsLZfDsD30TLGiD9Du4QNDAn+rHQHdzOwH/OZIMrrMHyqaIbr0rIYf/b7bP+aSJf+/o0H//ENtPQxcU+bjMZ/mrnL6cxXfdRdugSAAAAAElFTkSuQmCC","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxklEQVQ4jZ2TIRLDIBBFP0wFEomM7BEqe4TKHCVHyDEqIyMjK3sEJBKJxKWiw2aHFEL6ZsIw2f1/WJYV2FhxDkELgNWHSJEw36vKeXEYJg8AQnCx0QrRdlWxujoAwNgbDJOH5EEfIiWUxD5E8NPKPKlkksQ5EjiuuYYEAP14NSUbregrnoAHc6LtdpdMd5Ccj7qQQwbc/ZcJ/8f3ZFBrXw7P3bXxLBL4Pk37vDWLeAkXHnBv02QwL1sJNExj3yZO8GFK/DXOH/LaTf2eFY5BAAAAAElFTkSuQmCC","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAz0lEQVQ4jZ2TLRLDIBCFH5kIJBKJ7BEqIyMje4QeoUfoMSorkZGVOUIlEomMS0UKgYQtSd9MMpOw7wP2h2HRhGNi4QVgsm4MK043P526N7g9LQAwFpul4CFofKus2QwygVTxonVjePjJZAHqbJPvKhv1hVGQDcDpBlLw5AprUbAKAET3Ku5EqfYniKsAzAmlErkBrI0AXQUSUDJS/wPAX4HvPLoXWcbDgMdV7Uqc70SvGpjbsmsVulbBDOVddb/0RBim+0XmownFw+T11zh/AJRgTcUm7oXjAAAAAElFTkSuQmCC"]

}

const superMarioBlockChars = "⛹█▓▆▅▄□▤▦▩☵▫[]≣║│╔╕╚╛◠╭╮▣";
const smSmall = "▫";
for (block in superMarioBlockChars) {
  charImages.push(new Image)
}
const sm_halfY = "▫▣";
const sm_halfX = "▫";
function findImageCharKey(charCode, str = "") {
  const char = String.fromCharCode(charCode);
  const index = str.indexOf(char);
  if (index >= 0) {
    return [Object.keys(BlockImageSrc)[index], index];
  }
}

function isCharOfType(charCode, str = "") {
  const char = String.fromCharCode(charCode);
  const index = str.indexOf(char);
    return index >= 0;
}

function CycleImage(imageArray, index) {
  return imageArray[index % imageArray.length];
}

function isValidImageSymbol(charCode) {
return isCharOfType(charCode,superMarioBlockChars)

}

function fillImageChar(charCode, textRender, x, y, clampW, clampH) {
  var tmpCellW = clampW / tileC;
  var tmpCellH = clampH / tileR;
  var sx = Math.floor(x * tmpCellW);
  var sy = Math.floor(y * tmpCellH);
  var ex = Math.floor((x + 1) * tmpCellW);
  var ey = Math.floor((y + 1) * tmpCellH);

  tmpCellW = ex - sx;
  tmpCellH = ey - sy;

  // Super Mario Blocks
  const [charKey, charIndex] = findImageCharKey(charCode, superMarioBlockChars);

  if (charKey !== undefined) {
    const imageSrc = CycleImage(BlockImageSrc[charKey], globalTickItorator);
    charImages[charIndex].src = imageSrc;
  } else {
    return false
  }
if(isCharOfType(charCode,sm_halfY)){

    sy -= tmpCellH - (tmpCellH*1.5);

    
    
}
if(isCharOfType(charCode,sm_halfX)){


    sx -= tmpCellW - (tmpCellW*1.5);
    
    
}
  

    textRender.drawImage(charImages[charIndex], sx, sy, ex - sx, ey - sy);



  return true
}

function fillBlockChar(charCode, textRender, x, y, clampW, clampH, flags) {
  var isBold = flags ? flags & 1 : 0;
  var isOverflow = flags ? flags & 2 : 0;
  //Check if the symbol should be an specific image.
  if (isValidImageSymbol(charCode)) {
    return fillImageChar(charCode, textRender, x, y, clampW, clampH);
  } else if (!isValidSpecialSymbol(charCode)) {
    return false;
  }
  if (isOverflow) return true; // ignore
  var transform = [0, 1]; // (left, right, up, down = 0, 1, 2, 3), percentage

  var tmpCellW = clampW / tileC;
  var tmpCellH = clampH / tileR;
  var sx = Math.floor(x * tmpCellW);
  var sy = Math.floor(y * tmpCellH);
  var ex = Math.floor((x + 1) * tmpCellW);
  var ey = Math.floor((y + 1) * tmpCellH);
  tmpCellW = ex - sx;
  tmpCellH = ey - sy;

  switch (charCode) { // 1/8 blocks
    case 0x2580:
      transform = [2, 4 / 8];
      break;
    case 0x2581:
      transform = [3, 1 / 8];
      break;
    case 0x2582:
      transform = [3, 2 / 8];
      break;
    case 0x2583:
      transform = [3, 3 / 8];
      break;
    case 0x2584:
      transform = [3, 4 / 8];
      break;
    case 0x2585:
      transform = [3, 5 / 8];
      break;
    case 0x2586:
      transform = [3, 6 / 8];
      break;
    case 0x2587:
      transform = [3, 7 / 8];
      break;
    case 0x2588:
      transform = [0, 8 / 8];
      break; // full block
    case 0x2589:
      transform = [0, 7 / 8];
      break;
    case 0x258A:
      transform = [0, 6 / 8];
      break;
    case 0x258B:
      transform = [0, 5 / 8];
      break;
    case 0x258C:
      transform = [0, 4 / 8];
      break;
    case 0x258D:
      transform = [0, 3 / 8];
      break;
    case 0x258E:
      transform = [0, 2 / 8];
      break;
    case 0x258F:
      transform = [0, 1 / 8];
      break;
    case 0x2590:
      transform = [1, 4 / 8];
      break;
    case 0x2594:
      transform = [2, 1 / 8];
      break;
    case 0x2595:
      transform = [1, 1 / 8];
      break;
    case 0x1FB82:
      transform = [2, 2 / 8];
      break;
    case 0x1FB83:
      transform = [2, 3 / 8];
      break;
    case 0x1FB84:
      transform = [2, 5 / 8];
      break;
    case 0x1FB85:
      transform = [2, 6 / 8];
      break;
    case 0x1FB86:
      transform = [2, 7 / 8];
      break;
    case 0x1FB87:
      transform = [1, 2 / 8];
      break;
    case 0x1FB88:
      transform = [1, 3 / 8];
      break;
    case 0x1FB89:
      transform = [1, 5 / 8];
      break;
    case 0x1FB8A:
      transform = [1, 6 / 8];
      break;
    case 0x1FB8B:
      transform = [1, 7 / 8];
      break;
    default:
      var is2by2 = charCode >= 0x2596 && charCode <= 0x259F;
      var is2by3 = charCode >= 0x1FB00 && charCode <= 0x1FB3B;
      var is2by4 = charCode >= 0x1CD00 && charCode <= 0x1FBE7;
      var is90degTri = charCode >= 0x25E2 && charCode <= 0x25E5;
      var isIsoTri = charCode == 0x25B2 || charCode == 0x25BA || charCode == 0x25BC || charCode == 0x25C4;
      var isTriangleShard = (charCode >= 0x1FB3C && charCode <= 0x1FB6F) ||
        (charCode >= 0x1FB9A && charCode <= 0x1FB9B) ||
        isBold && (is90degTri || isIsoTri);
      if (is2by2) { // 2x2 blocks
        var pattern = [2, 1, 8, 11, 9, 14, 13, 4, 6, 7][charCode - 0x2596];
        textRender.beginPath();
        if (pattern & 8) textRender.rect(sx, sy, tmpCellW / 2, tmpCellH / 2);
        if (pattern & 4) textRender.rect(sx + tmpCellW / 2, sy, tmpCellW / 2, tmpCellH / 2);
        if (pattern & 2) textRender.rect(sx, sy + tmpCellH / 2, tmpCellW / 2, tmpCellH / 2);
        if (pattern & 1) textRender.rect(sx + tmpCellW / 2, sy + tmpCellH / 2, tmpCellW / 2, tmpCellH / 2);
        textRender.fill();
        return true;
      } else if (is2by3) { // 2x3 blocks
        var code = 0;
        if (charCode >= 0x1FB00 && charCode <= 0x1FB13) code = charCode - 0x1FB00 + 1;
        if (charCode >= 0x1FB14 && charCode <= 0x1FB27) code = charCode - 0x1FB00 + 2;
        if (charCode >= 0x1FB28 && charCode <= 0x1FB3B) code = charCode - 0x1FB00 + 3;
        textRender.beginPath();
        for (var i = 0; i < 6; i++) {
          if (!(code >> i & 1)) continue;
          textRender.rect(sx + (tmpCellW / 2) * (i & 1), sy + (tmpCellH / 3) * (i >> 1), tmpCellW / 2, tmpCellH / 3);
        }
        textRender.fill();
        return true;
      } else if (isTriangleShard) { // LCS shard characters
        var vecIndex = charCode - 0x1FB3C;
        if (charCode >= 0x1FB9A && charCode <= 0x1FB9B) {
          vecIndex -= 42;
        } else if (is90degTri) {
          vecIndex = (charCode - 0x25E2) + 54;
        } else if (isIsoTri) {
          switch (charCode) {
            case 0x25B2:
              vecIndex = 58;
              break;
            case 0x25BA:
              vecIndex = 59;
              break;
            case 0x25BC:
              vecIndex = 60;
              break;
            case 0x25C4:
              vecIndex = 61;
              break;
          }
        }
        var vecs = lcsShardCharVectors[vecIndex];
        var gpX = [0, tmpCellW / 2, tmpCellW];
        var gpY = [0, tmpCellH / 3, tmpCellH / 2, (tmpCellH / 3) * 2, tmpCellH];
        textRender.beginPath();
        for (var i = 0; i < vecs.length; i++) {
          var vec = vecs[i];
          var gx = gpX[vec[0]];
          var gy = gpY[vec[1]];
          if (i == 0) {
            textRender.moveTo(sx + gx, sy + gy);
            continue;
          }
          textRender.lineTo(sx + gx, sy + gy);
        }
        textRender.closePath();
        textRender.fill();
        return true;
      } else if (is2by4) { // 2x4 LCS octant characters
        var code = 0;
        if (charCode >= 0x1CD00 && charCode <= 0x1CDE5) {
          code = lcsOctantCharPoints[charCode - 0x1CD00];
        } else {
          switch (charCode) {
            case 0x1CEA8:
              code = 1;
              break;
            case 0x1CEAB:
              code = 2;
              break;
            case 0x1CEA3:
              code = 64;
              break;
            case 0x1CEA0:
              code = 128;
              break;
            case 0x1FBE6:
              code = 20;
              break;
            case 0x1FBE7:
              code = 40;
              break;
          }
        }
        if (!code) return false;
        textRender.beginPath();
        for (var py = 0; py < 4; py++) {
          for (var px = 0; px < 2; px++) {
            var idx = py * 2 + px;
            if (code >> idx & 1) {
              textRender.rect(sx + px * (tmpCellW / 2), sy + py * (tmpCellH / 4), tmpCellW / 2, tmpCellH / 4);
            }
          }
        }
        textRender.fill();
        return true;
      } else {
        return false;
      }
  }
  var dir = transform[0];
  var frac = transform[1];

  switch (dir) {
    case 0:
      ex -= tmpCellW - (tmpCellW * frac);
      break;
    case 1:
      sx += tmpCellW - (tmpCellW * frac);
      break;
    case 2:
      ey -= tmpCellH - (tmpCellH * frac);
      break;
    case 3:
      sy += tmpCellH - (tmpCellH * frac);
      break;
  }

  textRender.fillRect(sx, sy, ex - sx, ey - sy);
  return true;
}

//just to show grid
renderTiles(true)
setInterval(function() {
  renderTiles(true);
globalTickItorator ++;
}, 300)
