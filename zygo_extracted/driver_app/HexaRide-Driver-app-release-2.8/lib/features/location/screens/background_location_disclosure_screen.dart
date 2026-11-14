import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ride_sharing_user_app/common_widgets/button_widget.dart';
import 'package:ride_sharing_user_app/util/dimensions.dart';
import 'package:ride_sharing_user_app/util/images.dart';
import 'package:ride_sharing_user_app/util/styles.dart';

class BackgroundLocationDisclosureScreen extends StatelessWidget {
  const BackgroundLocationDisclosureScreen({super.key});

  static Future<bool> show() async {
    final result =
        await Get.to<bool>(() => const BackgroundLocationDisclosureScreen());
    return result ?? false;
  }

  @override
  Widget build(BuildContext context) {
    final Color textColor =
        Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;

    return SafeArea(
      top: false,
      child: Scaffold(
        body: Center(
          child: SizedBox(
            width: Dimensions.webMaxWidth,
            child: Padding(
              padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),
              child: Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      child: ConstrainedBox(
                        constraints: BoxConstraints(
                          minHeight: MediaQuery.of(context).size.height -
                              MediaQuery.of(context).padding.top -
                              MediaQuery.of(context).padding.bottom -
                              120,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Image.asset(Images.location, height: 120),
                            const SizedBox(
                              height: Dimensions.paddingSizeOverLarge,
                            ),
                            Text(
                              'allow_background_location_access'.tr,
                              textAlign: TextAlign.center,
                              style: textBold.copyWith(
                                fontSize: Dimensions.fontSizeOverLarge,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: Dimensions.paddingSizeLarge),
                            Text(
                              'background_location_disclosure_message'.tr,
                              textAlign: TextAlign.center,
                              style: textRegular.copyWith(
                                fontSize: Dimensions.fontSizeLarge,
                                height: 1.5,
                                color: Theme.of(context).hintColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  ButtonWidget(
                    buttonText: 'continue'.tr,
                    onPressed: () => Get.back(result: true),
                    radius: Dimensions.radiusSmall,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
