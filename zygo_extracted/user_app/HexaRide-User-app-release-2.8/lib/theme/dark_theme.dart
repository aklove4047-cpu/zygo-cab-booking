import 'package:flutter/material.dart';
import 'package:ride_sharing_user_app/theme/custom_theme_color.dart';
import 'package:ride_sharing_user_app/util/app_constants.dart';

ThemeData darkTheme = ThemeData(
  useMaterial3: false,

  fontFamily: AppConstants.fontFamily,

  // 🟢🔵 Zygo Primary Colors
  primaryColor: const Color(0xFF1FB6A6), // green-blue
  primaryColorDark: const Color(0xFF0E5CAD), // deep blue

  disabledColor: const Color(0xFF8A8F94),

  // 🌑 Dark backgrounds (clean & premium)
  scaffoldBackgroundColor: const Color(0xFF0B1F23),
  canvasColor: const Color(0xFF112C30),

  cardColor: const Color(0xFF16393E),

  shadowColor: Colors.black.withOpacity(0.4),

  brightness: Brightness.dark,
  hintColor: const Color(0xFF9FA8A9),

  // 📝 TEXT
  textTheme: const TextTheme(
    bodyLarge: TextStyle(color: Colors.white),
    bodyMedium: TextStyle(color: Colors.white70),
    bodySmall: TextStyle(color: Color(0xFFF4C430)), // yellow highlight
    titleMedium: TextStyle(
      color: Color(0xFFF4C430),
      fontWeight: FontWeight.w600,
    ),
    titleLarge: TextStyle(color: Colors.white),
    labelLarge: TextStyle(color: Colors.white),
  ),

  // 🎨 COLOR SCHEME
  colorScheme: const ColorScheme.dark(
    primary: Color(0xFF1FB6A6), // green-blue
    secondary: Color(0xFFF4C430), // taxi yellow
    error: Color(0xFFFF6B6B),

    surface: Color(0xFF112C30),
    onSurface: Colors.white,

    primaryContainer: Color(0xFF0E5CAD),
    onPrimaryContainer: Colors.white,

    secondaryContainer: Color(0xFF7A5A14),
    onSecondaryContainer: Color(0xFFFFE9A6),

    onPrimary: Colors.black,
    onSecondary: Colors.black,

    outline: Color(0xFF2FA4A0),

    inverseSurface: Color(0xFF16393E),
    surfaceContainer: Color(0xFF1C474D),

    errorContainer: Color(0xFF402020),
    onErrorContainer: Color(0xFFFFB4B4),
  ),

  // 🔘 Buttons
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: const Color(0xFFF4C430),
    ),
  ),

  extensions: <ThemeExtension<CustomThemeColors>>[
    CustomThemeColors.dark(),
  ],
);
