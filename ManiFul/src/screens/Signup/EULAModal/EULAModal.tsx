import {
  Button,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useState } from 'react';

const EULAModal = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <View style={{ height: '100%' }}>
      <Text>Eula</Text>
      <ScrollView
        scrollEnabled
        style={{ backgroundColor: 'white', maxHeight: '70%', padding: 10 }}>
        <TouchableWithoutFeedback>
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '800',
                marginBottom: 20,
              }}>
              End User License Agreement (EULA) – Beta Release
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 20,
              }}>
              PLEASE READ THIS AGREEMENT CAREFULLY. BY INSTALLING OR USING THIS
              APPLICATION, YOU AGREE TO THE TERMS OF THIS AGREEMENT. IF YOU DO
              NOT AGREE, DO NOT INSTALL OR USE THE APPLICATION.
            </Text>

            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              1. LICENSE GRANT.{' '}
              <Text style={{ fontWeight: '400' }}>
                You are granted a limited, non-exclusive, non-transferable,
                revocable license to install and use this application solely for
                personal evaluation, review, and testing purposes. Any other
                use, including commercial use, product development, or
                real-world financial management, is not permitted.
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              2. BETA SOFTWARE NOTICE.{' '}
              <Text style={{ fontWeight: '400' }}>
                This application is a beta release and is provided for testing
                only. It may contain errors, bugs, and security vulnerabilities.
                It is not intended for production use. You should not rely on
                this application for managing sensitive financial information,
                and you are solely responsible for any decisions made based on
                its use.
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              3. SECURITY AND DATA RESPONSIBILITY.{' '}
              <Text style={{ fontWeight: '400' }}>
                The application may not be secure. You understand and accept
                that any data you enter or store in the application is at your
                own risk. You are solely responsible for safeguarding your
                personal, financial, and account information.
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              4. NO WARRANTIES.{' '}
              <Text style={{ fontWeight: '400' }}>
                The application is provided “AS IS” and “AS AVAILABLE” without
                any warranties of any kind, express or implied. The author
                disclaims all warranties, including but not limited to
                merchantability, fitness for a particular purpose, accuracy, or
                reliability.
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              5. LIMITATION OF LIABILITY.{' '}
              <Text style={{ fontWeight: '400' }}>
                To the fullest extent permitted by law, the author shall not be
                liable for any direct, indirect, incidental, consequential,
                special, or punitive damages, including but not limited to loss
                of data, loss of profits, unauthorized access, or security
                breaches resulting from the use of this application.
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              6. UPDATES AND SUPPORT.{' '}
              <Text style={{ fontWeight: '400' }}>
                There is no guarantee that the application will be updated,
                patched, or supported. The author may modify, suspend, or
                discontinue the application at any time without notice.
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              7. TERMINATION.{' '}
              <Text style={{ fontWeight: '400' }}>
                This agreement is effective upon your installation or use of the
                application. It may be terminated immediately if you breach any
                terms. The author reserves the right to revoke access or remove
                the application at any time.
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              8. GOVERNING LAW.{' '}
              <Text style={{ fontWeight: '400' }}>
                This agreement shall be governed by and construed in accordance
                with the laws of FINLAND.
              </Text>
            </Text>
            <Text
              style={{
                color: 'grey',
                marginTop: 10,
                marginBottom: 10,
                fontSize: 13,
              }}>
              © 2025 Patrick Palmroos. All rights reserved.
            </Text>
            <View style={{ marginBottom: 30 }} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <CheckBox
        disabled={false}
        value={toggle}
        onValueChange={v => setToggle(v)}
      />
      <Button disabled={!toggle} title="confirm" />
      <Button title="cancel" />
    </View>
  );
};

export default EULAModal;
