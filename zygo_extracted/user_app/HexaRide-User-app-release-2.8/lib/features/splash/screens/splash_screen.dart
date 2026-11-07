import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:ride_sharing_user_app/helper/login_helper.dart';
import 'package:ride_sharing_user_app/util/images.dart';
import 'package:ride_sharing_user_app/features/splash/controllers/config_controller.dart';

class SplashScreen extends StatefulWidget {
  final Map<String, dynamic>? notificationData;
  final String? userName;

  const SplashScreen({super.key, this.notificationData, this.userName});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  StreamSubscription<List<ConnectivityResult>>? _onConnectivityChanged;
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    _controller =
        AnimationController(vsync: this, duration: const Duration(seconds: 1));

    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(_controller)
      ..addListener(() {
        setState(() {});
      });

    _controller.forward();

    Get.find<ConfigController>().initSharedData();
    _checkConnectivity();
  }

  void _checkConnectivity() {
    bool isFirst = true;

    _onConnectivityChanged =
        Connectivity().onConnectivityChanged.listen((result) {
      bool isConnected = result.contains(ConnectivityResult.wifi) ||
          result.contains(ConnectivityResult.mobile);

      if (!isFirst || !isConnected) {
        ScaffoldMessenger.of(Get.context!)
          ..removeCurrentSnackBar()
          ..hideCurrentSnackBar()
          ..showSnackBar(
            SnackBar(
              backgroundColor: isConnected ? Colors.green : Colors.red,
              duration: Duration(seconds: isConnected ? 3 : 6000),
              content: Text(
                isConnected ? 'connected'.tr : 'no_connection'.tr,
                textAlign: TextAlign.center,
              ),
            ),
          );

        if (isConnected) {
          LoginHelper()
              .handleIncomingLinks(widget.notificationData, widget.userName);
        }
      } else {
        LoginHelper()
            .handleIncomingLinks(widget.notificationData, widget.userName);
      }
      isFirst = false;
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _onConnectivityChanged?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Theme.of(context).cardColor,
        width: double.infinity,
        height: double.infinity,
        child: SizedBox(
          height: Get.height,
          child: Stack(
            alignment: Alignment.bottomCenter,
            children: [
              /// Animated content
              Transform.translate(
                offset: Offset(
                  0,
                  320 - (320 * _animation.value),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    /// Logo
                    Opacity(
                      opacity: _animation.value,
                      child: Padding(
                        padding: EdgeInsets.only(
                          left: 120 - (120 * _animation.value),
                        ),
                        child: SvgPicture.asset(
                          Images.splashSvgLogo,
                          height: 120, // ✅ height fixed
                        ),
                      ),
                    ),

                    const Spacer(),

                    /// Background SVG (LIMITED HEIGHT)
                    SvgPicture.asset(
                      Images.splashSvgBackground,
                      height: Get.height * 0.30,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
