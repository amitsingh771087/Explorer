import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const isLoading = fetchStatus === "fetching";

  if (!signIn || signIn.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
      return;
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendEmailCode();
      setShowOTP(true);
    } else if (signIn.status === "needs_client_trust") {
      const emailcodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailcodeFactor) {
        await signIn.mfa.sendEmailCode();
        setShowOTP(true);
      }
    } else {
      console.error("Sign In attempt not Completed : ", signIn);
    }
  };

  const onVerifyPress = async () => {
    if (!signIn) return;
    try {
      await signIn.mfa.verifyEmailCode({ code });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl("/");
            router.replace(url as any);
          },
        });
        alert("Your account has been verified and created successfully!");
      }
    } catch (error) {
      console.log(error);
      alert("Verification failed. Please check the code and try again.");
    }
  };

  const ResendOtp = async () => {
    await signIn.mfa.sendEmailCode();
    alert("OTP has been resent to your email");
  };

  if (showOTP) {
    return (
      <View className="flex-1 justify-center px-6 py-12 ">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-36 h-20 self-center mb-10  "
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-center text-black mb-2">
          Verify Your Account
        </Text>
        <Text className="text-gray-500 text-center text-base mb-8">
          We Send a Code to your {email}
        </Text>
        <View className="flex-row items-center w-full py-3 rounded-lg mb-8">
          <Text className="text-gray-600">Wrong email? </Text>

          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
        <View className=" flex-row gap-3  mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Enter Verification Code"
            keyboardType="number-pad"
            placeholderTextColor="#9CA3Af"
            value={code}
            onChangeText={setCode}
          />
          {errors.fields.code && (
            <Text className="text-red-500 mb-4">
              {errors.fields.code.message}
            </Text>
          )}
        </View>
        <TouchableOpacity
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
          onPress={onVerifyPress}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base"> Verify</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={ResendOtp} className="py-2">
          <Text>Resend Code</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-8 ">
        <Image
          source={require("../../assets/images/kribb.png")}
          className=" w-36 h-20 self-center mb-10  "
          resizeMode="contain"
        />

        <Text className="text-4xl font-bold text-center text-black mb-2">
          Welcome Back
        </Text>
        <Text className="text-gray-500 text-center text-base mb-8">
          sign in to your account
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter Email"
          placeholderTextColor="#9ca3f"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.identifier && (
          <Text className="text-red-500 mb-4">
            {errors.fields.identifier.message}
          </Text>
        )}

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          placeholder="Password"
          placeholderTextColor="#9ca3f"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="text-red-500 mb-4">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
          onPress={onSignInPress}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base"> Sign In</Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center ">
          <Text className="text-gray-500">Don't have an account?</Text>
          <Link href="/sign-up">
            <Text className="text-blue-600 font-semibold"> Sign Up</Text>
          </Link>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
};

export default SignIn;
