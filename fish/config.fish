# set up env vars
set -Ux GOPATH $HOME/.go
set -gx EDITOR nvim

# set -gx PKG_CONFIG_PATH $PKG_CONFIG_PATH /usr/local/lib/pkgconfig

if status is-interactive
    set -g fish_greeting
    # Commands to run in interactive sessions can go here
    alias ls="lsd"
    alias ll="lsd -l"
    alias la="lsd -la"

    alias proxySet="export http_proxy=http://127.0.0.1:7890 && export https_proxy=http://127.0.0.1:7890"
    alias ProxyClr="export http_proxy= && export https_proxy="

    alias restartSnd="systemctl --user restart pipewire pipewire-pulse wireplumber"
    alias piMount="sshfs alarm@pi:/mnt/WDR /mnt/PiShare"
    alias piUnMnt="fusermount3 -u /mnt/PiShare"

    alias podpro="podman run --rm --network=host -e HTTP_PROXY='http://127.0.0.1:7890' -e HTTPS_PROXY="http://127.0.0.1:7890" -d"

    alias virsh="virsh -c qemu:///system"
    alias virshCoreOS="virsh -c qemu:///system start CoreOS"
    # alias virshCoreOS="virsh -c qemu:///system start CoreOS --console"

    # mpv with proxy
    alias ppv="mpv --http-proxy=http://127.0.0.1:7890"

    fish_add_path $HOME/.local/bin
    fish_add_path $HOME/Projects/flutter/bin
end

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
# if test -f /home/derren/.local/bin/miniconda/bin/conda
#     eval /home/derren/.local/bin/miniconda/bin/conda "shell.fish" "hook" $argv | source
# else
#     if test -f "/home/derren/.local/bin/miniconda/etc/fish/conf.d/conda.fish"
#         . "/home/derren/.local/bin/miniconda/etc/fish/conf.d/conda.fish"
#     else
#         set -x PATH "/home/derren/.local/bin/miniconda/bin" $PATH
#     end
# end
# <<< conda initialize <<<
