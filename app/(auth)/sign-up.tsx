import { useAuth, useSignUp } from "@clerk/expo";
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

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isLoaded, isSignedIn } = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const isLoading = fetchStatus === "fetching";

  if (!isLoaded || !signUp || signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignUpPress = async () => {
    if (!signUp) return;
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }
    if (!error) await signUp.verifications.sendEmailCode();

    setShowOTP(true);
  };

  const onVerifyPress = async () => {
    if (!signUp) return;
    try {
      console.log("onVerifyPress");

      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
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
    await signUp.verifications.sendEmailCode();
    alert("OTP has been resent to your email");
  };

  if (showOTP) {
    return (
      <View className="flex-1 justify-center px-6 py-12 ">
        <Image
          source={require("../../assets/images/kribb.png")}
          className=" w-36 h-20 self-center mb-10  "
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-center text-black mb-2">
          Verify Your Account
        </Text>
        <Text className="text-gray-500 text-center text-base mb-8">
          We sent a code to {email}
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
      <View className="flex-1 justify-center px-6 py-12 ">
        <Image
          source={require("../../assets/images/kribb.png")}
          className=" w-36 h-20 self-center mb-10  "
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold text-center text-black mb-2">
          Create Account
        </Text>
        <Text className="text-gray-500 text-center text-base mb-8">
          Find Your Perfect Home Today
        </Text>
        <View className="flex-row gap-3 mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Enter First Name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="sentences"
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 mb-4"
            placeholder="Enter Last Name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="sentences"
          />
        </View>
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter Email"
          placeholderTextColor="#9ca3f"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.emailAddress && (
          <Text className="text-red-500 mb-4">
            {errors.fields.emailAddress.message}
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
          onPress={onSignUpPress}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base"> Sign Up</Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center ">
          <Text className="text-gray-500">Already have an account ?</Text>
          <Link href="/sign-in">
            <Text className="text-blue-600 font-semibold"> Sign In</Text>
          </Link>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
};

export default SignUp;
