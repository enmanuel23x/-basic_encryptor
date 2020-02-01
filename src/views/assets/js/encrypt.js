    function encrypt(){
        let str=document.getElementById("text").value
        str=verify(str,16)
        text = require('string-to-binary')(str);
        shell.value+=words.word1+document.getElementById("text").value+"\n\n"
        shell.value+=words.word2+text+"\n\n"
        text=bin2hex(text);
        //document.getElementById("text").value=text
        //text="3243F6A8885A308D313198A2E0370734"
        shell.value+=words.word3+text+"\n\n"
        var arr2 = text2matrix(text)
        //Clave Principal: 2B7E151628AED2A6ABF7158809CF4F3C
        //var clavep= text2matrix("2B7E151628AED2A6ABF7158809CF4F3C")
        var clavep=verify(document.getElementById('key').value,16)
        clavep= require('string-to-binary')(clavep);
        clavep=bin2hex(clavep);
        //document.getElementById('key').value=clavep
        clavep= text2matrix(clavep)
        claves=[]
        claves.push(clavep)
        for(contj=1;contj<11;contj++){
            i=contj
            claves.push([])
            claves[i]=step2(claves[i-1],claves[i],claves[i-1][3].slice(0),rcon[i-1].slice(0))
        }
        reply=[]
        for(conti=0;conti<claves.length;conti++){
            reply.push(upper(transpose(claves[conti])))
        }
        //Salida por Shell
        //Estado
        shell.value+=words.word4;print4x4(transpose(arr2))
        //Claves
        shell.value+=words.word5;printkeys(reply)
        let AddRoundKey = upper(step3(transpose(arr2).slice(0),transpose(clavep).slice(0)))
        let SubBytes,ShiftRows,MixColumns
        for(let myfinali=1;myfinali<reply.length-1;myfinali++){
            //Rondas 1-9
            SubBytes = upper(step4(AddRoundKey.slice(0)));
            ShiftRows= upper(step5(SubBytes.slice(0)));
            MixColumns =step6(ShiftRows.slice(0))
            finalprint([AddRoundKey,SubBytes,ShiftRows,MixColumns,reply[myfinali]],myfinali,0)
            AddRoundKey = upper(step3(MixColumns.slice(0),reply[myfinali].slice(0)))
        }
        //Ronda 10
        SubBytes = upper(step4(AddRoundKey.slice(0)));
        ShiftRows= upper(step5(SubBytes.slice(0)));
        MixColumns=[["  ","  ","  ","  "],["  ","  ","  ","  "],["  ","  ","  ","  "],["  ","  ","  ","  "]]
        finalprint([AddRoundKey,SubBytes,ShiftRows,MixColumns,reply[10]],10,0)
        //Texto encriptado
        AddRoundKey = upper(step3(ShiftRows.slice(0),reply[10].slice(0)))
        shell.value+=words.word6
        print4x4(AddRoundKey.slice(0))
        printencrypt(transpose(AddRoundKey.slice(0)))
    }
    //paso 2
    function step2(claveprev,clavepost,pivot,r){
        pivot.push(pivot.splice(0, 1)[0]);
        let myvalue=[]
        for(i=0;i<4;i++){
            myrow=sbox[parseInt((pivot[i].split("")[0]), 16)]
            myvalue.push(myrow[parseInt((pivot[i].split("")[1]), 16)])
        }
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
    //paso 3 | AddRoundKey
    function step3(state,key){
        let myvalue=[],row
        for(i=0;i<4;i++){
            row=[]
            for(j=0;j<4;j++){
                mya=state[i][j]
                if(mya.length % 2!=0){
                    mya="0"+mya
                }
                myb=key[i][j]
                if(myb.length % 2!=0){
                    myb="0"+myb
                }
                a = Buffer.from(mya, 'hex')
                b = Buffer.from(myb, 'hex')
                row.push(xor(a, b).toString('hex'))
            }
            if(myvalue.length==0){
                myvalue=[row];
            }else{
                myvalue.push(row)
            }  
        }
        return myvalue;
    }
    //paso 4 | SubBytes
    function step4(arr){
        let myvalue=[],fvalue=[]
        for(i=0;i<arr.length;i++){
            myvalue=[]
            for(j=0;j<arr[0].length;j++){
                myrow=sbox[parseInt((arr[i][j].split("")[0]), 16)]
                myvalue.push(myrow[parseInt((arr[i][j].split("")[1]), 16)])
            }
            if(fvalue.length==0){
                fvalue=[myvalue];
            }else{
                fvalue.push(myvalue)
            }
        }
        return fvalue;
    }
    //paso 5 | ShiftRows
    function step5(arr){
        let myvalue=[]
        for(i=0;i<4;i++){
            row=[]
            cont=0,j=i
            while(cont!=4){
                cont++;
                if(j==4){
                    j=0;
                }
                row.push(arr[i][j])
                j++;
            } 
            if(myvalue.length==0){
                myvalue=[row];
            }else{
                myvalue.push(row)
            }
        }
        return myvalue;
    }
    //paso 6 | MixColumns
    function step6(arr){
        let detarr=[
            ["02","03","01","01"],
            ["01","02","03","01"],
            ["01","01","02","03"],
            ["03","01","01","02"]
        ]
        let arr2ret=[],myval,Helper=[]
        myarr=transpose(arr)
        for(let i=0;i<myarr.length;i++){
            myval=myarr[i]
            Helper=[]
            for(let k=0;k<myarr[0].length;k++){
                Helper.push(step6multhelper(myval,detarr[k]))
            }
            if(arr2ret.length==0){
                arr2ret=[Helper]
            }else{
                arr2ret.push(Helper)
            }
        }
        return upper(transpose(arr2ret))
    }
    function step6multhelper(marr1,marr2){
        let retvalue="",tempvalue
        for(let mi=0;mi<marr1.length;mi++){
            if(marr2[mi]==1){
                tempvalue=marr1[mi]
            }else if(marr2[mi]==2){
                tempvalue=step6helper(marr1[mi].toLowerCase())
            }else{
                a=marr1[mi]
                if(a.length % 2 != 0){
                    a="0"+a
                }
                myan = Buffer.from(a, 'hex')
                b=step6helper(marr1[mi].toLowerCase())
                if(b.length % 2 != 0){
                    b="0"+b
                }
                mybn = Buffer.from(b, 'hex')
                tempvalue= xor(myan, mybn).toString('hex')
            }
            tempvalue=tempvalue.toUpperCase()
            if(retvalue==""){
                retvalue=[tempvalue]
            }else{
                retvalue.push(tempvalue)
            }
        }
        let fval=""
        for(let mi=0;mi<retvalue.length-1;mi++){
            if(fval==""){
                a = retvalue[mi]
            }else{
                a =fval
            }
            if(a.length % 2 != 0){
                a="0"+a
            }
            mya = Buffer.from(a, 'hex')
            b=retvalue[mi+1]
            if(b.length % 2 != 0){
                b="0"+b
            }
            myb = Buffer.from(b, 'hex')
            fval= xor(mya, myb).toString('hex')
        }
        return fval
    }
    function step6helper(txtorigin){
        txt= hex2bin(txtorigin)
        let myarr=[]
        let mval=""
        myarr= txt.split("")
        if(myarr.length==8){
            myarr.shift()
            myarr.push("0")
        
        for(myi=0;myi<myarr.length;myi++){
            mval+=myarr[myi]
        }
        a = bin2hex(mval)
        if(a.length % 2 != 0){
            a="0"+a
        }
        af = Buffer.from(a, 'hex')
        bf = Buffer.from("1B", 'hex')
        return xor(af, bf).toString('hex')
        }else{
            myarr.push("0")
            for(myi=0;myi<myarr.length;myi++){
                mval+=myarr[myi]
            }
            return bin2hex(mval)
        }
    }
    //Imprimir matrices 4x4
    function print4x4(arr){
        for(i=0;i<4;i++){
            for(j=0;j<4;j++){
                shell.value+=arr[i][j]+" "
            }  
            shell.value+="\n"
        }
        shell.value+="\n"
    }
    //Imprimir claves
    function printkeys(arr){
        shell.value+=words.word7
        let n1=0,n2=6
        for(j=0;j<reply[0].length;j++){
            for(mi=n1;mi<n2;mi++){
                printrow(reply[mi][j])
            }
            shell.value+="\n"
            if(j==3 & n1==0){
                shell.value+=words.word8
                n1=6
                n2=11
                j=0
            }
        }
        shell.value+="\n"
    }
    function printrow(arr){
        for(i=0;i<arr.length;i++){
            shell.value+=arr[i]+" "
        }
        shell.value+="  "
    }
    //Imprimpir matrices de cifrado
    function finalprint(arr,n,b){
        if(n!=10){
            shell.value+=words.word9+n+words.word10
        }else{
            shell.value+=words.word11+n+words.word12
        }
        shell.value+="Entrada:      SubBytes:     ShiftRows:    MixColumns:   Subclave:\n"
        for(j=0;j<arr[0].length;j++){
            for(mi=0;mi<arr.length;mi++){
                printrow(arr[mi][j])
            }
            shell.value+="\n"
        }
        if((n==10 && b==0) || (n==1 && b==1)){
            shell.value+="--------------------------------------------------------------------------------------------"
        }
        shell.value+="\n"
    }
    //Imprimir texto cifrado
    function printencrypt(arr){
        for(i=0;i<arr.length;i++){
            for(j=0;j<arr.length;j++){
                finalout.value+=arr[i][j]
            }
        }
    }
    //transposicion de matrices
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
    //Elevar caracteres
    function upper(arr){
        for(let i=0;i<arr.length;i++){
            for(let j=0;j<arr[0].length;j++){
                arr[i][j]=arr[i][j].toUpperCase()
            }
        }
        return arr
    }
    //Convertidos de texto en matrices
    function text2matrix(text){
        let ar1=[],ar2=[],c=0
        while(text.length>0){
            ar1.push(text.substring(0, 2))
            text=text.substring(2)
            c++;
            if(c==4){
                if(ar2.length<=0){
                    ar2=[ar1];
                }else{
                    ar2.push(ar1);
                }
                ar1=[]
                c=0;
            }
        }
        return ar2
    }
    //Rellenar con espacios
    function verify(t,n){
        let r=t,j=0
        if(t.length<n){
            for(let i=0;i<n-t.length;i++){
                r+=" "
            }
        }
        return r
    }
