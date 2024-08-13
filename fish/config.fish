# set up go path
set -x -U GOPATH $HOME/.go

if status is-interactive
    set -g fish_greeting
    # Commands to run in interactive sessions can go here
    alias ls="lsd"
    alias ll="lsd -l"
    alias la="lsd -la"

    alias proxySet="export http_proxy=http://127.0.0.1:7890 && export https_proxy=http://127.0.0.1:7890"
    alias ProxyClr="export http_proxy= && export https_proxy="

    alias restartSnd="systemctl --user restart pipewire pipewire-pulse wireplumber"
    alias piMount="sudo mount -vvv -t nfs -o vers=3 10.0.0.10:/mnt/WDR /mnt/PiShare"

    # app with proxy
    alias ppv="mpv --stream-lavf-o-append=http_proxy=http://127.0.0.1:7890"

    alias icat="kitten icat"

    fish_add_path $HOME/.local/bin
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

