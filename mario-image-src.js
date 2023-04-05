const imgBase = "https://ik.imagekit.io/poopman/Mario/";
const imgUpdate = "?updatedAt=1680723084498";
const getImage = (imgName) => {
  return imgBase + imgName + imgUpdate;
}

const SMImageSrc = {
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
  pipe_opening_right_h: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAA60lEQVRoge2ZsQ3DIBBFPxaFy5SM4NJlRvBYHisjuMwYHoGOFJHDRYQoQpiLxP/VFxK6pzs4EBg8FdBW5jBD48CJCGDwrf5rxUiL8Ndo1TNAAIsV77WWfkE9zZ+H1TNAAIMNQe5L+Gh375MJNeQu48urZ4AAdp88HGJNcI/WzWM6o1C59aSeAQIMbqxX5yIA1egEAGDlvgcA3M4JlOsp6hkggIFHkEcBNuEz97gSybOA94G/AmAfIAABCDCcte9/B1AWASwW5N+IGkg9AwSwSR/gO2FvADYZYR/oD6BxzVMAZRHg+MPl33G/AA9v+SEnPS7n5QAAAABJRU5ErkJggg=="],
  pipe_body_h: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAAa0lEQVRoge3ZsQ2AMBBD0X/oBmcsRqDMGJSU6WAMF/e9QJ6syEUCZnoK+JKAI3m4AIDmzALiDQgobndgOKCed3sHZgOK7Q4MBzQrC4g3IMAdEOAOCBAgoLmygHgDAnwfEOAOCBAgwD8jAcb8VZ0RTd6heDoAAAAASUVORK5CYII="],
  pipe_body_left_v: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAQElEQVRIiWNkQID/DAwMDAwNUJ4HhHqh8YOBgYGBQYKDAyJwASpvAKGYGCgEowaMGjBqwKgBowaMGjBqwGAzAADJ9AU3O5nsOAAAAABJRU5ErkJggg=="],
  pipe_body_right_v: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAANUlEQVRIiWNkOMHwnwEZ7IDSHmh8GGiAsxgZGBgYmBgoBKMGjBowasCoAaMGjBowasBgMwAAQpcEQPSGm0IAAAAASUVORK5CYII="],
  pipe_opening_left_up: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAeElEQVRIiWNkQID/DGQAJnI0IQNGuM0noCIGEOrFjx9YNUhwcKDIU+wCFjhrB5qMBqqNcHABKm7AQR0XjBowasDgMACRFxpQJWBpHZb24QAtz1CxPCATUMUFMABxCSwsPCDUCw1IyQMvF2BhYkAlF4waMGrA4DAAAOkbE4XueDaxAAAAAElFTkSuQmCC"],
  pipe_opening_right_up: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAaElEQVRIiWNkYGD4z0AeYGRgYGBgIlMzkik/cLjgApQ2QOPDgAWEotgFLBgmw8AOAnwGKrlg1IBRAwaHASy40jhDAwE+tVzAyEB+iUQdF7AwnEATgYWJBxofBhBhQZ0ycdSAUQMGhwEAaD4NOyzt9EoAAAAASUVORK5CYII="],
  pipe_opening_left_down: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAe0lEQVRIiWNkQID/DAwMDAwNUJ4HhHqh8YOBgYGBQYKDAyJwASpvAKGYGCgEowaMGjA4DGBkgOWBgXIBC4YILDdWQOkLaPI7oLQH1V2AXg78gJYDBhzYdY6WB6MGDC8DEOXBCagINI3D8gI6gNWRMHmquAAGyCqZKHYBAOlPFe3p4mG2AAAAAElFTkSuQmCC"],
  pipe_opening_right_down: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAZElEQVRIiWNkOMHwnwEZ7IDSHmh8GGiAsxgZGBgYmBgoBKMGjBowOAxgZGBAywv0dgELUu5CBQ04aOq7wIOAClzyDVRywagBowYMDgMYGX7gKA8uQGkDND4MWFDNBeSXSNSpnQGv4w1P8Cv0EgAAAABJRU5ErkJggg=="],
  bush_top: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAkUlEQVRIie2RwQ2DMAxFHygrMQbihNRFMgVD9FqJEyv0ykAc3UNDGsAJkXr1k74U82THKGAYhpFHQqp8cxLgQzXVeRflLvqkZULCkKx3Ue6iA9bTygXvouzQufGtKtP6zrMhat4I/vp9eY6/2iMNW+HJ1uNty2uM5+ExA1AekKA1l39ByWH9kOoNcrT/NNuALx/C+mNTTrW8aAAAAABJRU5ErkJggg=="],
  bush_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAj0lEQVRIie2RwQ2AIAxFv8YLMziHYzAOU7iVuzBDj/VAECigwMkDP2lCKK/9LcDU1NTUX7QMMBzzPQUcaKKbE9iaYQ/qNNFSwMEePFo7+jBgXGBQOUo74GRO/d61PoKwbImwK5U9kw7CvFFXS/ScZZG1bu4blgU4y0ZQCQbCCOk/N36VdNANewfFxY05GNANeikr/DzWeKcAAAAASUVORK5CYII="],
  bush_right: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAsElEQVRIie2SsQ2EMAxFf1BWyhiI6qRbhCmyyElXITa49gaiDAU4crCdQJ8npSDmf778ATqdTscmnecW7iIE5vMpirmKz2ISjmwakVomPotJGAD8W9/lBiQO90WcQRU/MtuQ1PNDwpwbMVvx1kCkMBY6VNNxk6Mlkchha/w01MgqEgGAqyfgjPp1OwFPQVCaaOxg+bzKiwCzWmFAYmFiUBhw0fT+lm9el6ktkURCXGEHvPM3p05u5YMAAAAASUVORK5CYII="],
  lucky_block: [getImage("q-block-upper-01.png"),getImage("q-block-upper-02.png"),getImage("q-block-upper-03.png"),getImage("q-block-upper-04.png")],
  mario_Standing: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC"],
  mario_walking: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB/UlEQVRIie2UIZfaQBSFv3DWF4lLcHFlXR3wCxZcZOrqMrjKrKvLrKuMxBFcZXB1RMYBDpk63KsYMiQQ6NZU9Z0zybxJ7s29b14G/ofz6OEM5Hotu8J0EtTA1USZhe/AFzOd57pF8tQFroHrY8XHrzs8nuFHwnr0+bGFGrw+ViYv0/v+rtXPQGSiJPNDwVh4z7iAMz/8W7AA9O7pExUhJzGjMe+0ICoSKXLLLCoy4yQmPz87563oiYpEH7NbCeG8W1mRSxK4luhiIV1dtOk3Myk3iIogXSFFDuXmhtCpLTTBUuRmPpqQBC5qMGuB9DFjsTw4zULImehWxeNwagvONUiK3Cq5B7aXuvcz6JTclN6MxfLgODOQ0A87Aem5lceBa9dUukeHnr3bn+ll0G+Bh5ULo4Rd/wBHk+9+KguuwxLowWUbh8UUTYUOxkzpo5YbNBXTbykv14WYgYwD17Lq0ANgszwAMCq3ABT+s80/xDNbA5LAFTnJzUgCV+Jya/O43NrcGyUdnfjOGH7SRL6mbufeYnlwatm2HqHHr9hs2eu+4HVfAJAGOZGvUbH9T8R2YtLYqrUfAzAJRnatBtexONfoqQl+K81Z6PnmpXxZ/NHSzaEKsM+qh6D664BjCVQ8h1i3lOyLRfvg9F1pgA1D00KT+YEA6Xqnfcr+y/gNVd0x+2BIzPQAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg=="],
  mario_walking2: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB/UlEQVRIie2UIZfaQBSFv3DWF4lLcHFlXR3wCxZcZOrqMrjKrKvLrKuMxBFcZXB1RMYBDpk63KsYMiQQ6NZU9Z0zybxJ7s29b14G/ofz6OEM5Hotu8J0EtTA1USZhe/AFzOd57pF8tQFroHrY8XHrzs8nuFHwnr0+bGFGrw+ViYv0/v+rtXPQGSiJPNDwVh4z7iAMz/8W7AA9O7pExUhJzGjMe+0ICoSKXLLLCoy4yQmPz87563oiYpEH7NbCeG8W1mRSxK4luhiIV1dtOk3Myk3iIogXSFFDuXmhtCpLTTBUuRmPpqQBC5qMGuB9DFjsTw4zULImehWxeNwagvONUiK3Cq5B7aXuvcz6JTclN6MxfLgODOQ0A87Aem5lceBa9dUukeHnr3bn+ll0G+Bh5ULo4Rd/wBHk+9+KguuwxLowWUbh8UUTYUOxkzpo5YbNBXTbykv14WYgYwD17Lq0ANgszwAMCq3ABT+s80/xDNbA5LAFTnJzUgCV+Jya/O43NrcGyUdnfjOGH7SRL6mbufeYnlwatm2HqHHr9hs2eu+4HVfAJAGOZGvUbH9T8R2YtLYqrUfAzAJRnatBtexONfoqQl+K81Z6PnmpXxZ/NHSzaEKsM+qh6D664BjCVQ8h1i3lOyLRfvg9F1pgA1D00KT+YEA6Xqnfcr+y/gNVd0x+2BIzPQAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg=="],
  mario_jumping: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACM0lEQVRIia2VoXLjMBCGP3UCyq7wWFwW1vQJ4rBjdZmhy45ZYQfzBlbYQUOzOKzsnCeoj5k1YYWFYXtAkWInTqbtnGZ2LK33//XveiUrPjGyeChuPiu26jNYsngoshNvbbIvgd1zcAkYgQCsiy3rwipe7rob9xI44DLU1vEb+Gmnj9eqQ3JCEIE44OrtnbtfrwTcw3PGavwEgEkCoKeQEYiEWspRIuUoEaySXnMqe8GXgEd2AH9k1z6Cq74iAohOkZ1Ya81bm3aCRerKM4tOre3ErvfvZCcioRYJta/BlehUzFt5KiF57JdmIsz3pV8eUsgPTmUWdtKsEZ1CvkTqCpq1jylBAQyUWSjRqbi8lVnYYECNQwCyeIjO+wW5RvDVEZ12VZwfqp3CydGUuvJKLmxsJ+2uSkYJDz++9aLMW8ltPSVqck8wcL3vKvvKH1bPUwDyxiY+iYcALBqN4W9XSgQyiYfofGN32R+U23qKvr6zpDdbAKbhHZvynU09O6SQxUNx4I7cJOC2nmLiCQC6sJ/QxJMOycULJW9ywth+lXz+tPdOTgP7rqx58yLz5sX7jte+iOAuhsA7V6M54SVpreGLEYwzAQiiGwDCeNwLqIqayqeDOnucq6LurPO4Yj6656GZI412bnEEXv6mfD9Lku37QY2M9w0AsS8Miz2zIwmiG/L4bDsDRzdS2mJ2RJt6ptqNMyu2nRh1UNAJOPffO/6dKfYEIo2WnoBzJCdxHwX///EPnoJ1rBWC8uAAAAAASUVORK5CYII="],
  mario_falling: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACDUlEQVRIicWVobLbMBBFjzIPlDWwzH4srOkfJF8Qhxkalln5gqaszA4rq6FZXFbofEFdZpiwwMCwLZCtWLZj8mbandFovdp7tXelKPC/TY0FA5B+rHiSOwgGINEiYvNhbgLfgc+wLdNRktkU+Bz9Ngu/kmkdLbhYRCIrLY2EqfEmsEPiSGh0ErjkkzZrdXcBRSeh63fIVDcoxSJ6Wrro2Jmf6u8TdACOP5AAkNWZU6ro2Mx3Qe4C0fbh9wkKUEcdI1XprkRbI/adcuYBgehY0msxujhmUpWShN7IMWZH66r0YJz6ZORkR1NhfRoQvqj0oJomITpGpQcrRy1XACShh87GK2qF2ZLaBtoqnpuC5iLJSpOEHkno0fZDqnLY2MaS0Ht8BCBJ6IncxY4k9ER0LFKVzkhCz+baRvbBXZIApN2gC+zmvEyJrJbmHTheLwCkkY/Ozk7ObJdfVBr5TjCNfF6rNen9D34wZ736yM/rjddqzfpbZnN2+UXZ69W9HKf8YsmWtXmVqsUnAG77H2zqPbv8ouxRAPjLRPxgboGrcAnAF9/MX88VAO/3AXq/RS1SAOU8KOfiNtUSytyQNGAA28Thz6yxdmeATb0frM8wxzSooswruyNAFo5fKishfpTFubg5clrwrtPc1lS/gkOtB0nnatd9DBy5tgK937LLL/3kwTfuv5P1xx/Mf2F/AcE7WqCCH7iFAAAAAElFTkSuQmCC"],
  mario_squatting: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABSUlEQVRIie2TLXaEMBSFPzgVld3BZFwk3QFLYBwyO4DsgB1AXd0gcbCE7KBIJOMqkXWpADL8TVXlfOdE5MG9777DA548efLkn/AePYjAbmvNwfu7wiysw3RnejHFzuhlK94KL6YYzT6hFhbv1YOxybp5BNaGqZ0SuGPD1DZSrWrL4y0NpnjYn/v4U8eH+AAiyA/FHN1b404en0aDWfwXNk2wrdnVPRHkVlUhAJl8JwLqRdfLNEKdJith8d2gq5vnvoKpWiJASeVEM3Wa4BUfh8H8WbxESYWSyu3C2QjsJsE8gb+8DdmVsivv8U3BkF0R0RtnIxBBTtZ9IYIcpj1YGSxNyq5kyK4AhHEwJqtCytjQt/p4E2faICeRBXQZAFreyOMTWmrXecbvW+31zeAKfTOM4gW2S9HVDdulsPnJnNu8TH2rj0JtcbpfhwCSTCqBdZsAAAAASUVORK5CYII="],
  mario_burnt: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABfklEQVRIid2UIZaDMBiEv/BWcAQkshJZ2SMgkSsrkRwhElm5EskRVlYikUiOgMuKkvRPIBS9815fE/LP/DMhAf4/SjDyP0RypljOwzUV6yjRjTXVpQWgDzhJSAoL9M/1JbIs8rGrV7Guq9gRFEBiybJz/5nsXGwcnCDuOwixLIv76Spz410HusoMQNPNjhxDmqb+W7DkSPHu2BM4Ilon7XfuxrrKjGzqRbAxdJVtxiGablZOALGRknwCykbYHOlY508wgM1ownnwHMC4zuJEHnZfozne5jKVwDPIb+frxnlxVewkDoUG4H5p3YaWRK4zQFff6eq7RwZ4jDVlNBAk1ypzRCtUDM1usb1oeaGd66+Y8rSK5Ksb62IQ5EOBEDLWNDTvt/DsZtr5/RWo2gdDoSlFd0m2sDGUHdjcvbDbC5GdeK+7UIIJ7NkObp7vrDuBvNBmvE1cfnMAxttE2j5cgVwfbxOAt654nXHPYnhcj2p2PyhnsAoaReQohw5iQn87pMdTVuCWCAAAAABJRU5ErkJggg=="],
  mario_Standing_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAByUlEQVRIie1UIZakMBD97JsDtBzXjEOyN2BOsLRDRq4jnCQZt7IlDtqNpE8wkcjGIZG4WpFJOiRhpg8w9V4eRSX/51eqEuDHEj9QAuTH+si6KEEJUFdw/fMPwF/tnga5S/TLD1zmBXgXAIAb+8BlXtAVHF3Bo+pcxmDSppAxAMCf5wNOg4wqoUdGnzGiglNMyUMEhqTPmCUxZ2Al0Up68HrjP2y0EgEgUoP+rkTEayJeWxWkBvN/r4KojgYUGjsFITn3IF5TUEaMV5AagHOnpY9XnaN8u685d9a1uYvqSPy5DHZp2kkTAkjyYnMeiXxLDMFuDxjzgNYNqhAA1WAV+GAAeHLWJrE03Hzl3G/APgGadkpQ9TadazsBANhnK1/H6Uu1upQr2SGqo+06KvhuG0fBLokBU8E3bQxErvNXdpmXIGYJmnZKJEs3k5KleFGvG/B5PEPlwq7ZHAitRC6Jf4gu+KaaJCBIc0FpeUBR5Tamst93PxdIywNu/WIJNmWMWT5+AACGViGNzAc1NSpu/QLWFhZszN39WwUucM+iXZXmYvdyubvvKaA6k2jaCaI6BpONJ8pvJKKR6zdg5CH4s6yu+Sl8+y74mP8wRDB+Q8ST+QAAAABJRU5ErkJggg=="],
  mario_walking_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAByUlEQVRIie1UIZakMBD97JsDtBzXjEOyN2BOsLRDRq4jnCQZt7IlDtqNpE8wkcjGIZG4WpFJOiRhpg8w9V4eRSX/51eqEuDHEj9QAuTH+si6KEEJUFdw/fMPwF/tnga5S/TLD1zmBXgXAIAb+8BlXtAVHF3Bo+pcxmDSppAxAMCf5wNOg4wqoUdGnzGiglNMyUMEhqTPmCUxZ2Al0Up68HrjP2y0EgEgUoP+rkTEayJeWxWkBvN/r4KojgYUGjsFITn3IF5TUEaMV5AagHOnpY9XnaN8u685d9a1uYvqSPy5DHZp2kkTAkjyYnMeiXxLDMFuDxjzgNYNqhAA1WAV+GAAeHLWJrE03Hzl3G/APgGadkpQ9TadazsBANhnK1/H6Uu1upQr2SGqo+06KvhuG0fBLokBU8E3bQxErvNXdpmXIGYJmnZKJEs3k5KleFGvG/B5PEPlwq7ZHAitRC6Jf4gu+KaaJCBIc0FpeUBR5Tamst93PxdIywNu/WIJNmWMWT5+AACGViGNzAc1NSpu/QLWFhZszN39WwUucM+iXZXmYvdyubvvKaA6k2jaCaI6BpONJ8pvJKKR6zdg5CH4s6yu+Sl8+y74mP8wRDB+Q8ST+QAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB+klEQVRIie2VIZbbMBCGP+9b3sAwp8zQN6hvsAkzW8OyKCeoewI7bGFgWBxWVucE8TKzJiwwZWFToEqWbWWbA3Te07M0mvnnH83MM/yXYKiYgwx1lcfOCzAH2SVKH96Ar3q7qMu7QE9Dxf5yhR8FAKfsyP5yZZcodonysnMRR5c2hSgD4GU6YVGXXibyyKqiTCRR4mPyEIABqaLMgpg3sJTkJnqpZW//sMhNBBBpav29iYhaiqilZSFNbc5dFYo0NE5jyRYjVXmpELWUURlpD0hTw2anqbcHnWO57mw2O7u1uRdpKGo6H0VZbc8aEAjipPceQbkODMDdHjAycLTbURVGjk1tGQydAZ4d28CbipNveal6tncjF2koAIftGYDsbytv2g3QHyrvODdxQXl7B+BX/NPeqYsupzsPvSoA7KMctT3wMp1QTjV9tTnpFLKZF0Q30U0kb492YIxuuIo09M4CZTbj2yymTL/w/e3V9zQfyywuLIu8Pdpow+hz6I1z4ALM5hOSNO4Bf8q7ku6jHIBTdeXUrEZ94JXfua59vW1GztC9waiV621jnczXZWv2z4AUaYjKz3xOoaaLBOMzwDIqWTUIEAQmepGG1mDdKk7NKnAjuc4AK92lHYCRIg3tpaMWN4AL8DQwNBeuiLTK6zyMgsPmX/8Le/8H+NpUAblrNdoAAAAASUVORK5CYII="],
  mario_walking2_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie2UrZLbMBSFP+/sAwQuc8ICU7ZsvU+wCTM0LIvyBllWZoUtNDSLw8rqPEFcZpaYGaYs7BYo0vovbWZKe2Y0lmTd43PuvRb8h9fdmIN097KBc4MEc5BtoMziA/hqpotc3yR66G7s6jN8jwE4RQd29ZltoNgGalBdk7H30lmYRgC8PY1Y5HpQidwzsmkkEigZUnIXgSXJppEjsTlwkuQiZqhla3435CICiBS5eV5ERC1F1NKpkCK3688qxKFvg/qIFr0tXWeIWkqvjJR7pMgh2Rrp5d541JvPM8nWTZ33OPRFPc17X1mllSEEvFnQyoenN54luNkDFp1AN+1VoRdY5E5BNxjg0cpvBrWsNPzqOgPg+lYy8Lw49EUlJ3Q0xj4t9mkFQHRt5S6SMjEKAJokk2fNcVShApicfRRwHFWt4F19xllo4vVbgr78ZFeDDl8YAyrds6vhOPvhzk3q189E2Bz8WmcU0y8AzMoDgFu/hL5TCqCjsbMIwHgWi1xE1uVB1uXBtPB1HYe+WzdHHPrSqIJm8gxRGgwm7BYeuDaRWi9YTjVJaGr+fip4PxVYa83qWAurtPI8SxBfPQJsStVSkqeG6K1cu72V8e/1qtANamJTmgt3OdXEoc8qreQRUwlZpVVLxSk7/81+C+6y6LY1mAqNZ7HEoW8qUip7ToZu5Zs/Fp18rdLqD0fvU/zv+A2SB0rRRqwEzQAAAABJRU5ErkJggg=="],
  mario_jumping_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACJ0lEQVRIiaWVrZLiQBSFv1AjkMhxZF3cZp9g8gYDLjLr1tG8QeQ6GjduInEEt47wBGRcHOCQsw53V3QSOiGh2N1T1dU/1ef0ubf/HEoswrFU7fnq5PA3WIRjkYvUxRZ7mPyvIk/tgenw6n4CApBCb0i1gEqOTIcO60CZgTfgRyma6V6hJ5Mwt7a7OX/ymr/Dcc4x2vPx80stOs20dLoprfaW1Isk9SKRQEkVVht3BWyhPpGHBGw3lcigDOGqdBFT1KzRvosJiATKlIsIIJJnpr6IiJqJqFntQvKs6hsHAPp5DXrSvUI0vRnS5xRRMxlAa3+LHZJnkKyN9WIHgKOXV3ayrps1cRGORT1fHehzynx1MnnJMzPZDxr5cPTSsQ/F3bNfERtOwBnYnU5intUOWnBuSKkXycHfYodiY/PrN0mRXOeDc3Mbl4UCNAC7MgeRFwFw8Le8+GMA1HnKNNPSEFDDr7iTESoz27YsJ3P54OBvzZzkCICO3Gbcrr8QdzJCrcy26fDFEFY7Dv62JtrQkXv7oFQxBqHJehJ/r23fRfWUxcVe4mIv7X7fk3fjoA8bL4Yybri+3FUOBCCI3wlCv1MgW+UAHNNPU+dzB8xlEgApFK9FTOx9IwmzTnIX6pPoeGbvF2EzYTa5Wt123ZuDyoU7GbWJzDwN3pj56iT2XahvH5gYj/nc6SRbaCSxY7wNsUO0F6xEHvnORApVnYPH/9C2yP+QG/gDXedzU12dIL4AAAAASUVORK5CYII="],
  mario_falling_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACG0lEQVRIicWVrZabUBSFv5s1ojJyXBiHa/oEkzzBJA5JXV0ublwZNw7iKqnDhbhK5glKXSQ4ZMbFnQoIXP7StVrRsxaLC5y97z4/9wD/29TUhw1I/10y4n83BT6sNHwDvlTvjuUZTpH0SWaT2n4EAOTuTwCe7ue4tjuqzDSZujYgstKS2K5MkUyCb5FMhwBseusE2KZhx8ckUH1Q0lub327lQ0TvxLyPhfLHXJjgPpFJMGgMuUjFenoD+7F6+ayrGMN943cNZzSJ6oPq3HG33U2ylIPekYBqCAJnIZKlN5vEtLBMEL2ToYLTG5KlEB0QvatC6cknOrRqTQX6vi1UWCZ4cdFIBlDLVUV6BYd7ZSbxdo/XwI6SXg7GgVnaKAjLhMBZEDgLZKXZgNw18qMcsADQz9+7LNGBsEyofOoQXauNXS4ichG5rgNnIYGzkE3dNKaPeQXOQjoDRUc5oWuhy6ru+2UV1iPdA2TazIsLdZWzfo14yNYcyzPr1UeszZzw8ouHbN1KNkLw4kJ1yni0feb+ZwCWp2oSZfanBvRoJNqLCwXtTBTtb8H3ea+BX60lAC/1cxpnHGvnPDkDXhUCdf2VHTaOt6wCtzaYyk8nn3cSXvLbRPXGavQ0Rk7arNM4a1SZu9eNNzxM1/43SfLk3AHv7LasiuEZaCpjLYPB+TDBXlwwo/un6UyoPPMGz15coP3ugPkbu87Hf7ff8I04b+vM2fIAAAAASUVORK5CYII="],
  mario_squatting_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABVElEQVRIie2SIZKDQBBF36QiIiPXZeIiOQJHGBxuWbcuww24AdkTBIkLewNuECSSuJXIuF5BwmaARK2kq7pqpun+8/vzYY455pjjn0JNFQ3IsFY86XWK98GTb0eNQXmYBHq8CIBcBZoYPruhIVhQHkYgMpXFLhLxrVMzIOJbeVxRMbGvg379+6xWCnM731ks0nCDVGWfz4bv9+J21l4qAIvRi1WJ2P0rUj0IwDLOLwrexb4Zp8kAwUpxemARrDrtkvoMQBZ2LCZFFLsXcxPunsUuEgPiJ0dJ6rNoL5UlE0KK3bMtNR6dJ75/2tEaZV7xqIHSXkpSn9FeyrbUaLOmTY69gQCyOqNNjg6QYwjtpRLlPllYEuV+/8o6+QAYDTdFO+lvScMNcX4hDTd98au2aLMeAQx/o0htifMLUrsW3u8ONEXrDDdVrIYMXrrytmYHUMUK4BdXBKkGLeZ/KAAAAABJRU5ErkJggg=="],
  mario_burnt_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABfklEQVRIid2UIZaDMBiEv/BWcAQkshJZ2SMgkSsrkRwhElm5EskRVlYikUiOgMuKkvRPIBS9815fE/LP/DMhAf4/SjDyP0RypljOwzUV6yjRjTXVpQWgDzhJSAoL9M/1JbIs8rGrV7Guq9gRFEBiybJz/5nsXGwcnCDuOwixLIv76Spz410HusoMQNPNjhxDmqb+W7DkSPHu2BM4Ilon7XfuxrrKjGzqRbAxdJVtxiGablZOALGRknwCykbYHOlY508wgM1ownnwHMC4zuJEHnZfozne5jKVwDPIb+frxnlxVewkDoUG4H5p3YaWRK4zQFff6eq7RwZ4jDVlNBAk1ypzRCtUDM1usb1oeaGd66+Y8rSK5Ksb62IQ5EOBEDLWNDTvt/DsZtr5/RWo2gdDoSlFd0m2sDGUHdjcvbDbC5GdeK+7UIIJ7NkObp7vrDuBvNBmvE1cfnMAxttE2j5cgVwfbxOAt654nXHPYnhcj2p2PyhnsAoaReQohw5iQn87pMdTVuCWCAAAAABJRU5ErkJggg=="],

  fireball1: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFFSURBVEhL7dHLSsNAGAXgk0xCjL0YWpAQUBTElSJekIKLIm58gHbhU3TtE4gLFz6BG3f2FVwqFUHcuChUsGqjRAzYW6YxM2PRIRXyCvkW88Nw5sDPIJVKpVKpfxQ5Y6IK4nvaNpvW68zQHM4Z+IC6RRgV8zJojB8IGf2lyhkLnuCIMDoxZ3K2vb4Cp1wCsQu2HwanQdksyVgsUWDmrMVi3lrIFi0VtgXsbsDe21Izc7ObikHqMhZLFIDSc4zC0ZfrdR6vbyO021CWl2CtraohjxyZiiULOH8HZbWM1z/Iul0PLQ9ovQF9iogxGZpIFggcj899TSi9/AjPg/sm8PqJ8KHJNS7cv9BEooATVKHyMyjE1zRSUz/6jeHV3Qvzuzc69IqMxZLfuDM1T8X4nvAj6OrhsEd5IZM3gu9uaDroKBf4twfwA3zZdBAfdXNkAAAAAElFTkSuQmCC"],
  fireball2: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE+SURBVEhL7dG/SsNAAMfxX+6SS3L2D0pprX+igqjVQW0XoW+gj+Dq4IP4EA66CI6OLoJjEaRx1UGoKJQKKtKYpkm81FKOc8gr5LMcHF9+wx0ymcyEJk9l1IDhcXoQceNUMFpJkgS2FwVMo4f4jVzewqtMJ4g8FU/DfhiIi2meq1hCQ3l3C8Nq0fREdGJBP5eZkhoYUpzl5wp5UluBXrAgXnooN2qkaE/VYt2oy0xJDZg5o2TWt4ENB3xnDV7/G6jOgm2uajSMZ2SmpAZ0SgE2vl5fHI/MY1Dm+Ly6AZ46gBjJ6l9qgCT46rbuRsF9G1hysNDcQ2nZGT+3hoDhQ2ZKasAIxIP5Ez+G7nOCWxfo9OC/dRH6vscIPZKZkvrGQdNyoMeNoa1fkjy3CSEQff+dB8kx86JrzUUs00wmowB/PQBemw4IvJ0AAAAASUVORK5CYII="],
  fireball3: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE+SURBVEhL7dE9SgNBGMbxZyab7GzMh8UmaggookEWothoQC8gWNl4AQuxF7yBhb0nsBbxABZiIUgIJqTUCEIKUTFRs9mPmTHIsIHMFfbXTPPnnXkZggnutrlIBb8ccF7N0RQlySTEcABhmefcc8+se7yo9B9VZ4RLfvCdEFWWTVOy6QCMgtp59F33kBrGlcoi2gCPyJOwNE3N3Q3ILQdfOQPEmYecy9LfPFtVWUR/gZ0mdmUZXv0J7xfX+JgabVkpwV5z4CWJtrI2QEqg/9BCyD0Ua1Us7e8A6ytA2kQQBqoa0wYYw0BkmIXMbBEol4HCDHizjdfGI+jAV9WYNsDq+S3/sy/8ThfovAG3bfzcNJDq9kRBslOVRfRvrGFBGoljwthRmJAgZHRHEEprKJo+IXvWnfes0lgsFovFJgB/62BnG00q2BwAAAAASUVORK5CYII="],
  featherFall1: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAACXBIWXMAAAsTAAALEwEAmpwYAAACJUlEQVRIie2UwUvTYRjHv785NbEZjAgJkqnZ5uyHusxNiSgSOgRaKIEFdfHUpT/A6FTXAqWrHQwPjlhUBOoMSg8mLKP5ywllph3KZiElJJv7dGoSbjbwEuEXnsvL+/3wPM/7vI8BaDuybcu9A/hvAJY1PeQoKcGwFVFR6uBEvYeXU681F1/JjVBYVIwkPPni0yUx3SEqqyqoP+QhFpsVsGVIEu5iwZV86BLcaWH5/XMG/DbMugbezMxsCbDvlhRrk5RMSHOSDv6Uc1epOq+2SXkXdP7iZaKRF0a2Cuy+OrestQV5jjXLOGAXtT7pa1h57z6q81qHsNlkmibRaDQzBFBhQQG8HYPZEZKveli/JZI39/Nb/f39eL1eIpHI2U09AOSrcXO/UTDQRup6A8kbNSQnT5JaHv8D4vf7sSxrMwBQbf0RQg8fpQ2pb+MkRqtJxcfSZ93d3TidTjICAB32NfLgyVDasL4UJjHqIRV/BsDgYJDmpqbsAECmaRIKhTYyWRomEfaQ+vIUgN7eHsrLXWQFAPJ6vQSDwY1MPg+TGKmCtUlu9z2mxludBtgzvYxlWUYgEGBxcVFlZS61t5+TrSUsqU9aWNWq3bUxB9kGZGJiwjBNE4fDofkP8zLsDpFa0I/huzruCqTvGblsZZ/Ph2HYhIrUULki9/eoppJu3RuJGX/9LJmiq9WkZa/Ys89NThlk0unWTs6cOppbCVvpH1hpOwD9Aui38ffl9DdZAAAAAElFTkSuQmCC"],
  featehrFall2: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAACXBIWXMAAAsTAAALEwEAmpwYAAACHElEQVRIie2U30tTcRjGnzPmZMwpjIjoInRhO555cFuyMSnIWnVVFlhURBJIF/0DIYOuCrrpl9JtN4PBPI1FRWDOqPQipK1onnSRFkOobBYxImQ75+nCtjWmI/SqHw+88OULn88L7wuvQBLriWFd9H/BPyWYy35F8vlL7HKLtG+yUjCYaW1spKpOjYBkzZqZScO9TeTWVjunesEPp0CxDgTAerOlNvxqehqyq5Nhn4GLb5+QNwJkP8izdXRYliU1Be0eL8MRhQwfJt+/Ji/tIHeDPAPyBNgAcNUZyLLMgYFzOH60F5idh/Y5Dq1jJ/Tu/dBce6AumeFxOVDVNZFIHJIkiaFQiMUULm6mdgUsvBgk06Pkm3HWm0wkWSlQVRU+n68C1hcnWJjsZuGCk/r5TjLcw6gX9Dgd1QKbzcZgMFiGs+PMj7VR/zJR+ovducsO93YWmQpBl9/P4WHlJ/yY+TGR2kK8BN++P8J2j5e/MqVHS0szh4YGl+FPD5mPi9QXHpQ7x2KUZbkCrhA4pTZevXmPXJpkfrSV2scyrCgKJUmqgknCWFzbN2MzkHkEmCwwBuIAtiAajSGTeYdIJAJVVYWV1i0Uj2pfj5/27FM0HDkNwdAFFnKI3lKQy+WQSqVWhEuCk3tFuo1ppK0yns02QcB3kDqSyeSqYClNGx0MbAD7D1YP6HcK169d5r4Dx9YEkyzPYK35Q07aXy74AST9Qnj227T4AAAAAElFTkSuQmCC"],
  featherLay: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAMAAAAsVwj+AAAAulBMVEUAAAD///81MzpISE6Oj5VdX2lERUnO0dg5PkgZKT4tMzmSoK52eHokKzDV3eIoLzH8///BxK7//9Xw7bH//OaKekj/+en/2Xz/2oH/56n/67rjqjn9u0tpRxr8wnddRCVxRxd1SR7/3Lf/q17OjVH/snX/uYM2LSbTUQBMKRJnTT3YUwp6WUf/UgAiCQAmHBkQAACwsLBdXV1VVVVRUVFGRkY5OTk4ODg1NTUxMTEnJyckJCQjIyP////ibzSGAAAAPnRSTlP/////////////////////////////////////////////////////////////////////////////////ALr7cTYAAAAJcEhZcwAACxMAAAsTAQCanBgAAAB/SURBVCiR7cgxCsIwFIDh/yWvpkVwUwQFB0EcXZxKTh/0AJ5BEDro0EJtjcbBxZ7AxW/8xDNk+MePI5yGcd6uwleEm2TP8hN16O/tuIudGgQWV3kkW2juxM6wvpq7aZ9PjL3EZg3K/ris9ZVStcscIB7goKONFAKgAJTEZASANxjTIN4RoqONAAAAAElFTkSuQmCC"],

  mario_Fly_Standing: [getImage("sm-fly-stand-right.png")],
  mario_Fly_walking: [getImage("sm-fly-run-right-01.png"), getImage("sm-fly-run-right-02.png"), getImage("sm-fly-run-right-03.png")],
  mario_Fly_walking2: [getImage("sm-fly-run-right-01.png"), getImage("sm-fly-run-right-02.png"), getImage("sm-fly-run-right-03.png")],
  mario_Fly_jumping: [getImage("sm-fly-right-01.png"), getImage("sm-fly-right-02.png"), getImage("sm-fly-right-03.png"), getImage("sm-fly-right-04.png"), getImage("sm-fly-right-05.png")],
  mario_Fly_falling: [getImage("sm-fly-fall-right.png")],
  mario_Fly_squatting: [getImage("sm-fly-squat-right.png")],

  mario_Fly_Standing_left: [getImage("sm-fly-stand-left.png")],
  mario_Fly_walking_left: [getImage("sm-fly-run-left-01.png"), getImage("sm-fly-run-left-02.png"), getImage("sm-fly-run-left-03.png")],
  mario_Fly_walking2_left: [getImage("sm-fly-run-left-01.png"), getImage("sm-fly-run-left-02.png"), getImage("sm-fly-run-left-03.png")],
  mario_Fly_jumping_left: [getImage("sm-fly-left-01.png"), getImage("sm-fly-left-02.png"), getImage("sm-fly-left-03.png"), getImage("sm-fly-left-04.png"), getImage("sm-fly-left-05.png")],
  mario_Fly_falling_left: [getImage("sm-fly-fall-left.png")],
  mario_Fly_squatting_left: [getImage("sm-fly-squat-left.png")],
  mushroom: [getImage("mushroom_big.png")],
  deathShroom: [getImage("mushroom_dead.png")],

  mario_small_Standing: [getImage("sm-small-run-right-01.png")],
  mario_small_walking: [getImage("sm-small-run-right-01.png")],
  mario_small_walking2: [getImage("sm-small-run-right-02.png")],
  mario_small_jumping: [getImage("sm-small-jump-right.png")],
  mario_small_falling: [getImage("sm-small-fall-right.png")],
  mario_small_squatting: [getImage("sm-small-squat-right.png")],

  mario_small_Standing_left: [getImage("sm-small-run-left-01.png")],
  mario_small_walking_left: [getImage("sm-small-run-left-01.png")],
  mario_small_walking2_left: [getImage("sm-small-run-left-02.png")],
  mario_small_jumping_left: [getImage("sm-small-jump-left.png")],
  mario_small_falling_left: [getImage("sm-small-fall-left.png")],
  mario_small_squatting_left: [getImage("sm-small-squat-left.png")],

  block_blank: [getImage("block-blank.png")],
  block_blank_stacked: [getImage("block-blank-stacked.png")],
  brick: [getImage("breakable-brick.png")],
  block_stacked: [getImage("breakable-brick-stacked.png")],
  brick_broken:  [getImage("breakable-brick-broken.png")],
  block_stacked_broken: [getImage("breakable-brick-stacked-broken.png")],
  flip_block: [getImage("flip-block-01.gif")],
  flip_block_spinning: [getImage("flip-block-01.gif"),getImage("flip-block-02.gif"),getImage("flip-block-03.gif"),getImage("flip-block-04.gif")],
  quad: [getImage("block-quad.png")],
  quad_stacked: [getImage("block-quad-stacked.png")],
  powerup_flower:[getImage("powerup-flower.png")]
}
