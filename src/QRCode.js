import React, {useState, useEffect} from 'react';
import QRCode from 'react-native-qrcode-svg';

function QrCodeComponent ({route}) {
    let value = route.params?.value;
    return (
        <QRCode
            value="http://awesome.link.qr"
        />
    );
}
export default QrCodeComponent;
