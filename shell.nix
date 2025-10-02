{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [
      nodejs_24
      (yarn-berry_4.override { nodejs = nodejs_24; })
      gnuplot
      # cpuset
    ];
  }
