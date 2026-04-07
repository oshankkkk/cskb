{ pkgs ? import <nixpkgs> {} }:

with pkgs;

mkShell {
  buildInputs = [
    clang-tools
  ];

  shellHook = ''
    echo "Dev environment loaded"
    echo "clangd: $(clangd --version)"
  '';
}
