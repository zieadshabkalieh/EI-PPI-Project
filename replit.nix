{pkgs}: {
  deps = [
    pkgs.xorg.libXfixes
    pkgs.xorg.libXext
    pkgs.xorg.libXdamage
    pkgs.xorg.libXcomposite
    pkgs.unzip
    pkgs.xorg.libxcb
    pkgs.xorg.libX11
    pkgs.cups
    pkgs.xorg.libxkbfile
    pkgs.gdk-pixbuf
    pkgs.cairo
    pkgs.pango
    pkgs.xorg.libXtst
    pkgs.atk
    pkgs.dbus
    pkgs.nspr
    pkgs.alsa-lib
    pkgs.nss
    pkgs.gtk3
    pkgs.glib
  ];
}
