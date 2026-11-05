import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text } from 'react-native';

type AnimatedSplashProps = {
  onReady: () => void;
  onFinished: () => void;
};

export default function AnimatedSplash({ onReady, onFinished }: AnimatedSplashProps) {
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textOffset = useRef(new Animated.Value(14)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const finishedRef = useRef(false);

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.back(1.35)),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textOffset, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(450),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished && !finishedRef.current) {
        finishedRef.current = true;
        onFinished();
      }
    });

    return () => {
      animation.stop();
    };
  }, [logoOpacity, logoScale, onFinished, overlayOpacity, textOffset, textOpacity]);

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} onLayout={onReady}>
      <Animated.Image
        source={require('../assets/splash-icon.png')}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textOffset }],
        }}
      >
        <Text style={styles.title}>Sadab Dhrubo</Text>
        <Text style={styles.subtitle}>Hello World app</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: '#6200ee',
    justifyContent: 'center',
  },
  logo: {
    height: 148,
    marginBottom: 18,
    width: 148,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },
});
