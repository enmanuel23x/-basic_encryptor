function decrypt(){
    let text=document.getElementById("text").value
    shell.value+=words.word3+text+"\n\n"
    var arr2 = text2matrix(text)
    var clavep=document.getElementById('key').value
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
    let AddRoundKey = upper(step3(reply[10].slice(0),transpose(arr2).slice(0)))
    let ShiftRows= upper(alterstep5(AddRoundKey.slice(0)));
    let SubBytes=alterstep4(ShiftRows.slice(0))
    let MixColumns=[["  ","  ","  ","  "],["  ","  ","  ","  "],["  ","  ","  ","  "],["  ","  ","  ","  "]] 
    finalprint([AddRoundKey,SubBytes,ShiftRows,MixColumns,reply[10]],10,1)
    for(let myfinali=reply.length-2;myfinali>=1;myfinali--){
        AddRoundKey = upper(step3(reply[myfinali].slice(0),SubBytes.slice(0)))
        MixColumns=alterstep6(AddRoundKey.slice(0))
        ShiftRows= upper(alterstep5(MixColumns.slice(0)));
        SubBytes=alterstep4(ShiftRows.slice(0))
        finalprint([AddRoundKey,SubBytes,ShiftRows,MixColumns,reply[myfinali]],myfinali,1)
    }
    AddRoundKey = upper(step3(reply[0].slice(0),SubBytes.slice(0)))
    shell.value+=words.word6
    print4x4(AddRoundKey.slice(0))
    printencrypt(transpose(AddRoundKey.slice(0)))
}
//Reverse | MixColumns
function alterstep6(arr){
    let detarr=[
        ["0E","0B","0D","09"],
        ["09","0E","0B","0D"],
        ["0D","09","0E","0B"],
        ["0B","0D","09","0E"]
    ]
    let arr2ret=[],myval,Helper=[]
    myarr=transpose(arr)
    for(let i=0;i<myarr.length;i++){
        myval=myarr[i]
        Helper=[]
        for(let k=0;k<myarr[0].length;k++){
            Helper.push(alterstep6multhelper(myval,detarr[k]))
        }
        if(arr2ret.length==0){
            arr2ret=[Helper]
        }else{
            arr2ret.push(Helper)
        }
    }
    return upper(transpose(arr2ret))
}
function alterstep6multhelper(marr1,marr2){
    let retvalue="",tempvalue
    for(let mi=0;mi<marr1.length;mi++){
        if(marr2[mi]=="09"){
            tempvalue=mul9[hex2dec(marr1[mi].toLowerCase())].toUpperCase()
        }else if(marr2[mi]=="0B"){
            tempvalue=mul11[hex2dec(marr1[mi].toLowerCase())].toUpperCase()
        }else if(marr2[mi]=="0D"){
            tempvalue=mul13[hex2dec(marr1[mi].toLowerCase())].toUpperCase()
        }else{
            tempvalue=mul14[hex2dec(marr1[mi].toLowerCase())].toUpperCase()
        }
        if(retvalue==""){
            retvalue=[tempvalue]
        }else{
            retvalue.push(tempvalue)
        }
    }
    a = Buffer.from(retvalue[0], 'hex')
    b = Buffer.from(retvalue[1], 'hex')
    val=xor(a, b).toString('hex')
    a = Buffer.from(retvalue[2], 'hex')
    b = Buffer.from(val, 'hex')
    val=xor(a, b).toString('hex')
    a = Buffer.from(retvalue[3], 'hex')
    b = Buffer.from(val, 'hex')
    val=xor(a, b).toString('hex')
    return val
}
//Reverse | SubBytes
function alterstep4(arr){
    let myvalue=[],fvalue=[],band
    for(k=0;k<arr.length;k++){
        for(l=0;l<arr[0].length;l++){
            for(i=0;i<sbox.length;i++){
                band=false
                for(j=0;j<sbox[0].length;j++){
                    if(arr[k][l]==sbox[i][j]){
                        myvalue.push(i.toString(16)+""+j.toString(16))
                        band=true
                        break
                    }
                }
                if(band){
                    break
                }
            }
        }
        if(fvalue.length==0){
            fvalue=[myvalue];
        }else{
            fvalue.push(myvalue)
        }
        myvalue=[]
    }
    return fvalue;
}
//Reverse | ShiftRows
function alterstep5(arr){
    let myvalue=[]
    for(i=0;i<4;i++){
        row=[]
        cont=0,j=alterstep5Helper(0-i)
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
function alterstep5Helper(n){
    switch(n){
        case 0:
            return 0
            break
        case -1:
            return 3
            break
        case -2:
            return 2
            break
        case -3:
            return 1
            break
    }
}