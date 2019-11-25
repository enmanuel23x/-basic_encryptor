document.getElementById("hexa").value="";
        document.getElementById("text").value="";
        function read(){
            var str=str=document.getElementById("text").value
            if(document.getElementById("text").value.length<16){
                for(i=0;i<16-document.getElementById("text").value.length;i++){
                    str+=" "
                }
            }
            var anyBase = require('any-base'),
            dec2hex = anyBase(anyBase.BIN, anyBase.HEX);
            hex2bin = anyBase(anyBase.HEX, anyBase.BIN);
            hex2dec = anyBase(anyBase.HEX, anyBase.DEC);
            text = require('string-to-binary')(str);
            document.getElementById("shell-out").value+="Text Input:"+document.getElementById("text").value+"\n"
            document.getElementById("shell-out").value+="Binary Input: "+text+"\n"
            text=dec2hex(text);
            document.getElementById("shell-out").value+="Hexadecimal Input: "+text+"\n"
            document.getElementById("hexa").value=text;
            var arr1=[],arr2=[],cont=0
            //ciclo para formar la matriz
            while(text.length>0){
                arr1.push(text.substring(0, 2))
                text=text.substring(2)
                cont++;
                if(cont==4){
                    if(arr2.length<=0){
                        arr2=[arr1];
                    }else{
                        arr2.push(arr1);
                    }
                    arr1=[]
                    cont=0;
                }
            }
            console.log(transpose(arr2))
            var clavep=[
                ["2B","7E","15","16"],
                ["28","AE","D2","A6"],
                ["AB","F7","15","88"],
                ["09","CF","4F","3C"]]
            claves=[]
            claves.push(clavep)
            var rcon=["01","02","04","08","10","20","40","80","1B","36"]
            for(contj=1;contj<11;contj++){
                i=contj
                claves.push([])
                claves[i]=step2(claves[i-1],claves[i],claves[i-1][3].slice(0),rcon[i-1].slice(0))
            }
            reply=[]
            for(conti=0;conti<claves.length;conti++){
                reply.push(transpose(claves[conti]))
            }
            console.log(reply)
        }
        function step2(claveprev,clavepost,pivot,r){
            pivot.push(pivot.splice(0, 1)[0]);
            var sbox=[
            ["63","7C","77","7B","F2","6B","6F","C5","30","01","67","2B","FE","D7","AB","76"],
            ["CA","82","C9","7D","FA","59","47","F0","AD","D4","A2","AF","9C","A4","72","C0"],
            ["B7","FD","93","26","36","3F","F7","CC","34","A5","E5","F1","71","D8","31","15"],
            ["04","C7","23","C3","18","96","05","9A","07","12","80","E2","EB","27","B2","75"],
            ["09","83","2C","1A","1B","6E","5A","A0","52","3B","D6","B3","29","E3","2F","84"],
            ["53","D1","00","ED","20","FC","B1","5B","6A","CB","BE","39","4A","4C","58","CF"],
            ["D0","EF","AA","FB","43","4D","33","85","45","F9","02","7F","50","3C","9F","A8"],
            ["51","A3","40","8F","92","9D","38","F5","BC","B6","DA","21","10","FF","F3","D2"],
            ["CD","0C","13","EC","5F","97","44","17","C4","A7","7E","3D","64","5D","19","73"],
            ["60","81","4F","DC","22","2A","90","88","46","EE","B8","14","DE","5E","0B","DB"],
            ["E0","32","3A","0A","49","06","24","5C","C2","D3","AC","62","91","95","E4","79"],
            ["E7","C8","37","6D","8D","D5","4E","A9","6C","56","F4","EA","65","7A","AE","08"],
            ["BA","78","25","2E","1C","A6","B4","C6","E8","DD","74","1F","4B","BD","8B","8A"],
            ["70","3E","B5","66","48","03","F6","0E","61","35","57","B9","86","C1","1D","9E"],
            ["E1","F8","98","11","69","D9","8E","94","9B","1E","87","E9","CE","55","28","DF"],
            ["8C","A1","89","0D","BF","E6","42","68","41","99","2D","0F","B0","54","BB","16"]]
            var myvalue=[]
            for(i=0;i<4;i++){
                myrow=sbox[parseInt((pivot[i].split("")[0]), 16)]
                myvalue.push(myrow[parseInt((pivot[i].split("")[1]), 16)])
            }
            const bitwiseBuffer = require('bitwise-buffer')
            const { xor, and, or, nor, not, leftShift, rightShift, lshift, rshift } = bitwiseBuffer
            myarr=[]
            for(i=0;i<claveprev.length;i++){
                for(j=0;j<claveprev[0].length;j++){
                    a = Buffer.from(claveprev[i][j], 'hex')
                    b = Buffer.from(myvalue[j], 'hex')
                    val=xor(a, b).toString('hex')
                    if(i==0){
                        a = Buffer.from(val, 'hex')
                        if(j==0){
                            str=r
                        }else{
                            str="00"
                        }
                        b = Buffer.from(str, 'hex')
                        val=xor(a, b).toString('hex')
                    }else{
                    }
                    myarr.push(val)
                    myvalue[j]=val
                }
            }
            let cont=0,arr1=[]
            for(i=0;i<myarr.length;i++){
                arr1.push(myarr[i])
                cont++;
                if(cont==4){
                    if(clavepost.length<=0){
                        clavepost=[arr1];
                    }else{
                        clavepost.push(arr1);
                    }
                    arr1=[]
                    cont=0;
                }
            }
            return clavepost
        }
        function transpose(matrix) {
            var copy=[],copy2=[]
            for(j=0;j<matrix[0].length;j++){
                copy=[]
                for(i=0;i<matrix.length;i++){
                    copy.push(matrix[i][j])
                }
                copy2.push(copy)
            }
            return copy2
        }
