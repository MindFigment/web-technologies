<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal"
                 role="dialog"
                 aria-labelledby="modalTitle"
                 aria-describedby="modalDescription"
            >
                <header class="modal-header" id='modalTitle'>
                    <slot name="header">
                        This is the default tile!
                    </slot>
                    <BaseButton
                        type="button"
                        @click="close"
                        aria-label="Close modal"
                    >
                        Zamknij
                    </BaseButton>
                </header>
                <section class="modal-body">
                    <slot name="body">
                        I'm the default body!
                    </slot>
                </section>
                <footer class="modal-footer">
                    <slot name="footer">
                    </slot>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        methods: {
            close () {
                this.$emit("close");
            }
        }
    };
</script>

<style>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    position: fixed;
    max-width: 100%;
    max-height: 100%;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
    justify-content: center;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

</style>
