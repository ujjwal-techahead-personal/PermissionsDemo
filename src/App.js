import {View, Text, StyleSheet, SafeAreaView, Alert, Image} from 'react-native';
import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
    check,
    openSettings,
    PERMISSIONS,
    request,
    RESULTS,
} from 'react-native-permissions';

const App = () => {
    const [pickedImage, setPickedImage] = useState(null);

    const checkAndGrantCameraPermissions = async () => {
        const rationale = {
            title: 'Photo Library Usage Permission',
            message:
                'We need permission to access the photo library to upload images in the app.',
            buttonPositive: 'Ok',
        };

        try {
            const permissionStatus = await check(
                Platform.OS === 'ios'
                    ? PERMISSIONS.IOS.PHOTO_LIBRARY
                    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            );

            if (permissionStatus !== RESULTS.GRANTED) {
                const permissionRequestResult = await request(
                    Platform.OS === 'ios'
                        ? PERMISSIONS.IOS.PHOTO_LIBRARY
                        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                    rationale,
                );

                if (permissionRequestResult !== RESULTS.GRANTED) {
                    Alert.alert(
                        'Grant Permission',
                        'Please grant photo library permission in settings to upload images.',
                        [
                            {
                                text: 'Open Settings',
                                onPress: () => {
                                    openSettings().catch(console.log);
                                },
                            },
                        ],
                    );
                    return false;
                }
            } else if (permissionStatus === RESULTS.GRANTED) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const openPicker = async () => {
        if (await checkAndGrantCameraPermissions()) {
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            })
                .then(image => {
                    setPickedImage(image.path);
                })
                .catch(console.log);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText} onPress={openPicker}>
                Choose image...
            </Text>

            {pickedImage ? (
                <Image
                    source={{uri: pickedImage}}
                    resizeMode="contain"
                    style={styles.imageStyles}
                />
            ) : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },

    headingText: {
        fontSize: 24,
        color: 'blue',
        marginTop: 50,
        textDecorationLine: 'underline',
    },

    imageStyles: {
        height: 400,
        width: 300,
        marginTop: 100,
    },
});

export default App;
