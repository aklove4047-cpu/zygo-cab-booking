import 'package:country_code_picker/country_code_picker.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:get/get.dart';
import 'package:ride_sharing_user_app/features/auth/screens/otp_log_in_screen.dart';
import 'package:ride_sharing_user_app/features/auth/screens/forgot_password_screen.dart';
import 'package:ride_sharing_user_app/features/settings/domain/html_enum_types.dart';
import 'package:ride_sharing_user_app/helper/display_helper.dart';
import 'package:ride_sharing_user_app/util/dimensions.dart';
import 'package:ride_sharing_user_app/util/images.dart';
import 'package:ride_sharing_user_app/util/styles.dart';
import 'package:ride_sharing_user_app/features/auth/controllers/auth_controller.dart';
import 'package:ride_sharing_user_app/features/auth/screens/sign_up_screen.dart';
import 'package:ride_sharing_user_app/features/settings/screens/policy_screen.dart';
import 'package:ride_sharing_user_app/features/splash/controllers/config_controller.dart';
import 'package:ride_sharing_user_app/common_widgets/button_widget.dart';
import 'package:ride_sharing_user_app/common_widgets/custom_text_field.dart';
import 'package:url_launcher/url_launcher.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  TextEditingController passwordController = TextEditingController();
  TextEditingController phoneController = TextEditingController();
  FocusNode phoneNode = FocusNode();
  FocusNode passwordNode = FocusNode();

  @override
  void initState() {
    super.initState();

    final auth = Get.find<AuthController>();
    final config = Get.find<ConfigController>().config;

    if (auth.getUserNumber(false).isNotEmpty) {
      phoneController.text = auth.getUserNumber(false);
    }

    passwordController.text = auth.getUserPassword(false);

    if (passwordController.text.isNotEmpty) {
      auth.setRememberMe();
    }

    if (auth.getLoginCountryCode(false).isNotEmpty) {
      auth.countryDialCode = auth.getLoginCountryCode(false);
    } else if (config?.countryCode != null) {
      auth.countryDialCode =
          CountryCode.fromCountryCode(config?.countryCode ?? "US").dialCode ??
              "+1";
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Theme.of(context).canvasColor,
        body: GetBuilder<AuthController>(builder: (authController) {
          return Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Image.asset(
                        Images.logoWithName,
                        height: 75,
                        width: 200,
                      ),
                    ),
                    const SizedBox(height: Dimensions.paddingSizeExtraLarge),
                    Text(
                      'ready_to_ride'.tr,
                      style: textBold.copyWith(
                          fontSize: Dimensions.fontSizeTwenty),
                    ),
                    const SizedBox(height: Dimensions.paddingSizeExtraSmall),
                    Text(
                      'log_in_message'.tr,
                      style: textMedium.copyWith(
                        color: Theme.of(context)
                            .textTheme
                            .bodyMedium
                            ?.color
                            ?.withValues(alpha: 0.7),
                        fontSize: Dimensions.fontSizeSmall,
                      ),
                      maxLines: 2,
                    ),
                    const SizedBox(height: Dimensions.paddingSizeSignUp),
                    CustomTextField(
                      isCodePicker: true,
                      hintText: 'phone'.tr,
                      inputType: TextInputType.phone,
                      countryDialCode: authController.countryDialCode,
                      controller: phoneController,
                      focusNode: phoneNode,
                      nextFocus: passwordNode,
                      inputAction: TextInputAction.next,
                      onCountryChanged: (CountryCode countryCode) {
                        authController.countryDialCode =
                            countryCode.dialCode ?? "+1";
                        authController
                            .setCountryCode(countryCode.dialCode ?? "+1");
                        FocusScope.of(context).requestFocus(phoneNode);
                      },
                      autoFocus: phoneController.text.isEmpty,
                    ),
                    const SizedBox(height: Dimensions.paddingSizeSmall),
                    CustomTextField(
                      hintText: 'enter_password'.tr,
                      inputType: TextInputType.text,
                      prefixIcon: Images.lock,
                      inputAction: TextInputAction.done,
                      isPassword: true,
                      controller: passwordController,
                      focusNode: passwordNode,
                    ),
                    Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(
                              Dimensions.paddingSizeExtraSmall),
                          child: InkWell(
                            onTap: () => authController.toggleRememberMe(),
                            child: Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                  child: Checkbox(
                                    value: authController.isActiveRememberMe,
                                    onChanged: (bool? value) =>
                                        authController.toggleRememberMe(),
                                  ),
                                ),
                                const SizedBox(
                                    width: Dimensions.paddingSizeExtraSmall),
                                Text(
                                  'remember_me'.tr,
                                  style: textRegular.copyWith(
                                    fontSize: Dimensions.fontSizeSmall,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const Spacer(),
                        TextButton(
                          onPressed: () {
                            Get.to(() => const ForgotPasswordScreen());
                          },
                          child: Text(
                            'forgot_password'.tr,
                            style: textRegular.copyWith(
                              fontSize: Dimensions.fontSizeSmall,
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                        )
                      ],
                    ),
                    authController.isLoading
                        ? Center(
                            child: SpinKitCircle(
                              color: Theme.of(context).primaryColor,
                              size: 40,
                            ),
                          )
                        : ButtonWidget(
                            buttonText: 'log_in'.tr,
                            radius: 50,
                            onPressed: () {
                              String phone = phoneController.text.trim();
                              String password = passwordController.text.trim();

                              if (phone.isEmpty) {
                                showCustomSnackBar(
                                    'phone_number_is_required'.tr);
                                FocusScope.of(context).requestFocus(phoneNode);
                              } else if (password.isEmpty) {
                                showCustomSnackBar('password_is_required'.tr);
                                FocusScope.of(context)
                                    .requestFocus(passwordNode);
                              } else {
                                authController.login(
                                  authController.countryDialCode ?? "+1",
                                  phone,
                                  password,
                                );
                              }
                            },
                          ),
                    const SizedBox(height: Dimensions.paddingSizeDefault),
                    ButtonWidget(
                      showBorder: true,
                      borderWidth: 1,
                      transparent: true,
                      buttonText: 'otp_login'.tr,
                      onPressed: () =>
                          Get.to(() => const OtpLoginScreen(fromSignIn: true)),
                      radius: 50,
                    ),
                    const SizedBox(height: Dimensions.paddingSizeLarge),
                    InkWell(
                      onTap: () => Get.to(
                        () => PolicyScreen(
                          htmlType: HtmlType.termsAndConditions,
                          image: Get.find<ConfigController>()
                                  .config
                                  ?.termsAndConditions
                                  ?.image ??
                              '',
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "terms_and_condition".tr,
                            style: textMedium.copyWith(
                              color: Theme.of(context).primaryColor,
                              fontSize: Dimensions.fontSizeSmall,
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  void navigateToMart(String url) async {
    try {
      await launchUrl(Uri.parse(url));
    } catch (_) {}
  }
}
