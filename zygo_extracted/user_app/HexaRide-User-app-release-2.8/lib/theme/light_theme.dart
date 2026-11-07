import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ride_sharing_user_app/theme/custom_theme_color.dart';
import 'package:ride_sharing_user_app/util/app_constants.dart';

ThemeData lightTheme = ThemeData(
  useMaterial3: false,

  fontFamily: AppConstants.fontFamily,

  // 🟢🔵 Zygo Brand Colors
  primaryColor: const Color(0xFF1FB6A6),
  primaryColorDark: const Color(0xFF0E5CAD),

  // 🟡 Accent Yellow
  secondaryHeaderColor: const Color(0xFFF4C430),

  disabledColor: Colors.grey.shade400,
  scaffoldBackgroundColor: const Color(0xFFF6FAF9),
  cardColor: Colors.white,

  shadowColor: Colors.black.withOpacity(0.06),

  brightness: Brightness.light,
  hintColor: const Color(0xFF8E8E8E),

  // 📝 TEXT THEME
  textTheme: const TextTheme(
    bodyLarge: TextStyle(color: Colors.black),
    bodyMedium: TextStyle(color: Colors.black87),
    bodySmall: TextStyle(color: Colors.black54),
    titleMedium: TextStyle(
      color: Colors.black,
      fontWeight: FontWeight.w600,
    ),
    titleLarge: TextStyle(color: Colors.black),
    headlineSmall: TextStyle(color: Colors.black),
    labelLarge: TextStyle(color: Colors.black),
  ),

  // 🟡 APP BAR
  appBarTheme: const AppBarTheme(
    backgroundColor: Color(0xFFF4C430),
    foregroundColor: Colors.black,
    elevation: 0,
    centerTitle: false,
    iconTheme: IconThemeData(color: Colors.black),
    titleTextStyle: TextStyle(
      color: Colors.black,
      fontSize: 18,
      fontWeight: FontWeight.w600,
    ),
    systemOverlayStyle: SystemUiOverlayStyle.dark,
  ),

  // 🟡 BOTTOM NAVIGATION
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: Colors.white,
    selectedItemColor: Color(0xFF1FB6A6),
    unselectedItemColor: Colors.black54,
    type: BottomNavigationBarType.fixed,
    elevation: 10,
    showUnselectedLabels: true,
  ),

  // 🧾 DIALOG
  dialogTheme: const DialogThemeData(
    backgroundColor: Colors.white,
    titleTextStyle: TextStyle(color: Colors.black),
    contentTextStyle: TextStyle(color: Colors.black87),
  ),

  // 🎨 COLOR SCHEME
  colorScheme: const ColorScheme.light(
    primary: Color(0xFF1FB6A6),
    secondary: Color(0xFFF4C430),
    error: Color(0xFFE53935),
    surface: Colors.white,
    onSurface: Colors.black,
    primaryContainer: Color(0xFFB2F1E7),
    onPrimaryContainer: Colors.black,
    onPrimary: Colors.white,
    onSecondary: Colors.black,
    outline: Color(0xFFE0E0E0),
  ),

  // 🔘 BUTTONS
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: const Color(0xFF0E5CAD),
    ),
  ),

  // 🚗 PAGE TRANSITIONS
  pageTransitionsTheme: const PageTransitionsTheme(
    builders: {
      TargetPlatform.android: ZoomPageTransitionsBuilder(),
      TargetPlatform.iOS: ZoomPageTransitionsBuilder(),
      TargetPlatform.macOS: ZoomPageTransitionsBuilder(),
      TargetPlatform.windows: ZoomPageTransitionsBuilder(),
      TargetPlatform.linux: ZoomPageTransitionsBuilder(),
    },
  ),

  // 🎨 CUSTOM EXTENSIONS
  extensions: <ThemeExtension<dynamic>>[
    CustomThemeColors.light(),
  ],
);
