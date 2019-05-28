line = h:Hanzi DIV p:Pinyins DIV t:Translation {
    if(h.length !== p.pinyin.length) 
        throw `error: size of hanzi and pinyin doesn't match! ${h.join()} and ${p.pinyin.join()}`;
    
    return {
        hanzi:  h,
        pinyin: p.pinyin,
        tone:   p.tone,
        trans:  t,
    }
}

Hanzi = h:(SingleHanzi / Divider)+ {
    return h;
}

SingleHanzi = h:[^ \t\r\n,\\.!?/] {
    return h
}

Pinyins = ps:Pinyin+ {
    let pinyin = ps.map(p => p.chars);
    let tone   = ps.map(p => p.tone);
    return {
        pinyin: pinyin,
        tone:   tone,
    }
}
Pinyin = chars:(Chars / Divider) tone:(Tone)? {
    return {
        chars: chars,
        tone: (tone) ? tone : 5
    };
}
Chars = char:Char+ {
    return char.join('');
}
Char = [a-zA-Z]
Tone = [1-5]

Divider = divider:SYMS+ {
    return divider.join('');
}

Translation = trans:.+ {
    return trans.join('').trim();
}

SYMS = [,\\.!?/]

DIV = [ \t\n\r]+